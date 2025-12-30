import OpenAI from 'openai';
import { env } from './config.js';
import { AutomatedFinding, AIInterpretation, IssueRecord, IssueSeverity } from './types.js';

const client = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : undefined;

export async function interpretFindings(
  siteUrl: string,
  findingsByUrl: Map<string, AutomatedFinding[]>,
  evidenceByUrl?: Map<string, { screenshotKey?: string; htmlKey?: string }>
): Promise<IssueRecord[]> {
  const records: IssueRecord[] = [];

  for (const [pageUrl, findings] of findingsByUrl.entries()) {
    for (const finding of findings) {
      const interpretation = await interpretWithFallback(finding, pageUrl);
      const evidence = evidenceByUrl?.get(pageUrl);
      records.push({
        id: finding.id,
        pageUrl,
        wcagId: finding.wcagId,
        severity: interpretation.risk,
        confidence: interpretation.confidence,
        needsReview: interpretation.needsReview,
        title: interpretation.title,
        description: interpretation.explanation,
        recommendation: interpretation.recommendation,
        selector: finding.selector,
        snippet: finding.snippet,
        screenshotKey: evidence?.screenshotKey,
        htmlKey: evidence?.htmlKey
      });
    }
  }

  return records;
}

async function interpretWithFallback(
  finding: AutomatedFinding,
  pageUrl: string
): Promise<AIInterpretation> {
  if (!client) {
    return fallbackInterpretation(finding);
  }

  const prompt = buildPrompt(finding, pageUrl);
  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt
    });
    const text = response.output_text ?? '';
    const parsed = parseStructured(text) ?? fallbackInterpretation(finding);
    return parsed;
  } catch {
    return fallbackInterpretation(finding);
  }
}

function fallbackInterpretation(finding: AutomatedFinding): AIInterpretation {
  const risk = guessSeverity(finding);
  return {
    title: finding.help || finding.description,
    explanation: finding.description,
    recommendation:
      'Review this element for WCAG compliance. Provide meaningful text, ensure sufficient contrast, and verify keyboard/screen reader behavior.',
    risk,
    confidence: 0.4,
    needsReview: true
  };
}

function guessSeverity(finding: AutomatedFinding): IssueSeverity {
  const impact = finding.impact?.toLowerCase() ?? '';
  if (impact.includes('critical') || impact.includes('serious')) return 'LEGAL';
  if (impact.includes('moderate')) return 'USABILITY';
  return 'BEST_PRACTICE';
}

function buildPrompt(finding: AutomatedFinding, pageUrl: string): string {
  return `
You are an accessibility auditor. Given an automated finding, classify risk and rewrite plainly.

Page: ${pageUrl}
Description: ${finding.description}
WCAG: ${finding.wcagId ?? 'unknown'}
Selector: ${finding.selector ?? 'n/a'}
Snippet: ${finding.snippet ?? 'n/a'}

Respond as JSON with: { "title": "...", "explanation": "...", "recommendation": "...", "risk": "LEGAL|USABILITY|BEST_PRACTICE", "confidence": 0-1, "needsReview": true|false }`;
}

function parseStructured(text: string): AIInterpretation | null {
  try {
    const obj = JSON.parse(text);
    if (!obj) return null;
    return {
      title: obj.title ?? 'Accessibility issue',
      explanation: obj.explanation ?? '',
      recommendation: obj.recommendation ?? '',
      risk: obj.risk ?? 'USABILITY',
      confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.5,
      needsReview: Boolean(obj.needsReview)
    } as AIInterpretation;
  } catch {
    return null;
  }
}

