import AxeBuilder from '@axe-core/playwright';
import pa11y from 'pa11y';
import { chromium } from 'playwright';
import { AutomatedFinding, PageSnapshot } from './types.js';
import { logger } from './logger.js';

export async function runAutomatedChecks(
  snapshots: PageSnapshot[]
): Promise<Map<string, AutomatedFinding[]>> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const findingsByUrl = new Map<string, AutomatedFinding[]>();

  try {
    for (const snapshot of snapshots) {
      const page = await context.newPage();
      await page.setContent(snapshot.html, { waitUntil: 'domcontentloaded' });

      const axeResults = await new AxeBuilder({ page }).analyze();
      const axeFindings: AutomatedFinding[] = axeResults.violations.map((violation, idx) => ({
        id: `axe-${idx}-${violation.id}`,
        wcagId: violation.tags?.find((t) => t.match(/wcag\\d{3}/i)) ?? undefined,
        impact: violation.impact ?? undefined,
        description: violation.description,
        help: violation.help,
        selector: violation.nodes[0]?.target?.[0]?.toString(),
        snippet: violation.nodes[0]?.html,
        tags: violation.tags
      }));

      const pa11yFindings = await runPa11y(snapshot.url);
      const combined = [...axeFindings, ...pa11yFindings];
      findingsByUrl.set(snapshot.url, combined);
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
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      log: {
        debug: () => {},
        error: () => {}
      }
    });

    return results.issues.map((issue: any, idx: number) => ({
      id: `pa11y-${idx}-${issue.code}`,
      wcagId: issue.code,
      impact: issue.type,
      description: issue.message,
      help: issue.context,
      selector: typeof issue.selector === 'string' ? issue.selector : undefined,
      snippet: typeof issue.context === 'string' ? issue.context : undefined
    }));
  } catch (err) {
    logger.warn({ err, url }, 'pa11y failed, continuing with axe findings only');
    return [];
  }
}

