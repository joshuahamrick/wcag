import { createHash } from 'node:crypto';
import { AutomatedFinding, PageSnapshot } from './types.js';
import { logger } from './logger.js';

// Lazy-load heavy dependencies to reduce startup memory
let playwrightModule: typeof import('playwright') | null = null;
let axeBuilderModule: typeof import('@axe-core/playwright') | null = null;
let pa11yModule: typeof import('pa11y') | null = null;

async function getPlaywright() {
  if (!playwrightModule) {
    playwrightModule = await import('playwright');
  }
  return playwrightModule;
}

async function getAxeBuilder() {
  if (!axeBuilderModule) {
    axeBuilderModule = await import('@axe-core/playwright');
  }
  return axeBuilderModule.default;
}

async function getPa11y() {
  if (!pa11yModule) {
    pa11yModule = await import('pa11y');
  }
  return pa11yModule.default;
}

function generateStableFindingId(source: string, finding: Omit<AutomatedFinding, 'id'>): string {
  const content = [source, finding.wcagId, finding.selector, finding.description].filter(Boolean).join('|');
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
  return `${source}-${hash}`;
}

function deduplicateFindings(findings: AutomatedFinding[]): AutomatedFinding[] {
  const seen = new Set<string>();
  const deduped: AutomatedFinding[] = [];
  for (const finding of findings) {
    const key = [finding.wcagId, finding.selector, finding.description].filter(Boolean).join('|');
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(finding);
    }
  }
  return deduped;
}

function sortFindings(findings: AutomatedFinding[]): AutomatedFinding[] {
  return findings.slice().sort((a, b) => {
    // Sort by impact severity first (critical > serious > moderate > minor)
    const impactOrder: Record<string, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    const aImpact = impactOrder[a.impact?.toLowerCase() ?? ''] ?? 4;
    const bImpact = impactOrder[b.impact?.toLowerCase() ?? ''] ?? 4;
    if (aImpact !== bImpact) return aImpact - bImpact;
    // Then by wcagId
    const wcagCompare = (a.wcagId ?? '').localeCompare(b.wcagId ?? '');
    if (wcagCompare !== 0) return wcagCompare;
    // Then by selector for stable ordering
    return (a.selector ?? '').localeCompare(b.selector ?? '');
  });
}

export async function runAutomatedChecks(
  snapshots: PageSnapshot[]
): Promise<Map<string, AutomatedFinding[]>> {
  const { chromium } = await getPlaywright();
  const AxeBuilder = await getAxeBuilder();
  const pa11y = await getPa11y();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const findingsByUrl = new Map<string, AutomatedFinding[]>();

  try {
    for (const snapshot of snapshots) {
      const page = await context.newPage();
      await page.setContent(snapshot.html, { waitUntil: 'domcontentloaded' });

      const axeResults = await new AxeBuilder({ page }).analyze();
      const axeFindings: AutomatedFinding[] = axeResults.violations.map((violation) => {
        const finding = {
          wcagId: violation.tags?.find((t) => t.match(/wcag\d{3}/i)) ?? undefined,
          impact: violation.impact ?? undefined,
          description: violation.description,
          help: violation.help,
          selector: violation.nodes[0]?.target?.[0]?.toString(),
          snippet: violation.nodes[0]?.html,
          tags: violation.tags
        };
        return { id: generateStableFindingId('axe', finding), ...finding };
      });

      const pa11yFindings = await runPa11y(snapshot.url);
      const combined = [...axeFindings, ...pa11yFindings];
      const deduped = deduplicateFindings(combined);
      const sorted = sortFindings(deduped);
      findingsByUrl.set(snapshot.url, sorted);
      await page.close();
    }
  } finally {
    await context.close();
    await browser.close();
  }

  return findingsByUrl;
}

async function runPa11y(url: string): Promise<AutomatedFinding[]> {
  try {
    const pa11y = await getPa11y();
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      log: {
        debug: () => {},
        error: () => {},
        info: () => {}
      }
    });

    return results.issues.map((issue: any) => {
      const finding = {
        wcagId: issue.code,
        impact: issue.type,
        description: issue.message,
        help: issue.context,
        selector: typeof issue.selector === 'string' ? issue.selector : undefined,
        snippet: typeof issue.context === 'string' ? issue.context : undefined
      };
      return { id: generateStableFindingId('pa11y', finding), ...finding };
    });
  } catch (err) {
    logger.warn({ err, url }, 'pa11y failed, continuing with axe findings only');
    return [];
  }
}

