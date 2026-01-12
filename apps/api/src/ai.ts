import { env } from './config.js';
import { AutomatedFinding, AIInterpretation, IssueRecord, IssueSeverity } from './types.js';
import { logger } from './logger.js';

// Lazy-load Anthropic SDK to reduce startup memory
let client: any = null;
let clientInitialized = false;

async function getClient() {
  if (clientInitialized) return client;
  clientInitialized = true;

  if (!env.ANTHROPIC_API_KEY) {
    logger.warn('ANTHROPIC_API_KEY not set; using fallback (non-AI) interpretations');
    return null;
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    logger.info({ model: env.CLAUDE_MODEL }, 'AI client initialized');
    return client;
  } catch (err) {
    logger.error({ err }, 'Failed to initialize Anthropic SDK');
    return null;
  }
}

// Log AI status at startup
if (env.ANTHROPIC_API_KEY) {
  logger.info('AI interpretations enabled (Claude)');
}

const interpretationTool = {
  name: 'submit_interpretation',
  description: 'Submit the structured accessibility interpretation',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: {
        type: 'string',
        description: 'A concise title for the accessibility issue'
      },
      explanation: {
        type: 'string',
        description: 'Plain-language explanation of the issue and its impact on users'
      },
      recommendation: {
        type: 'string',
        description: 'Specific, actionable fix for the issue'
      },
      risk: {
        type: 'string',
        enum: ['LEGAL', 'USABILITY', 'BEST_PRACTICE'],
        description: 'Risk level: LEGAL for ADA/WCAG violations, USABILITY for user experience issues, BEST_PRACTICE for minor improvements'
      },
      confidence: {
        type: 'number',
        description: 'Confidence score from 0 to 1'
      },
      needsReview: {
        type: 'boolean',
        description: 'Whether a human should review this interpretation'
      }
    },
    required: ['title', 'explanation', 'recommendation', 'risk', 'confidence', 'needsReview']
  }
};

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
  const aiClient = await getClient();
  if (!aiClient) {
    return fallbackInterpretation(finding);
  }

  try {
    const response = await aiClient.messages.create({
      model: env.CLAUDE_MODEL,
      max_tokens: env.CLAUDE_MAX_TOKENS,
      tools: [interpretationTool],
      tool_choice: { type: 'tool', name: 'submit_interpretation' },
      messages: [
        {
          role: 'user',
          content: buildPrompt(finding, pageUrl)
        }
      ]
    });

    // Extract tool use result
    const toolUse = response.content.find(
      (block: any) => block.type === 'tool_use'
    );

    if (toolUse && toolUse.name === 'submit_interpretation') {
      const input = toolUse.input as Record<string, unknown>;
      return {
        title: String(input.title ?? 'Accessibility issue'),
        explanation: String(input.explanation ?? ''),
        recommendation: String(input.recommendation ?? ''),
        risk: (input.risk as IssueSeverity) ?? 'USABILITY',
        confidence: typeof input.confidence === 'number' ? input.confidence : 0.5,
        needsReview: Boolean(input.needsReview)
      };
    }

    return fallbackInterpretation(finding);
  } catch (err) {
    logger.warn({ err }, 'AI interpretation failed; falling back to heuristic interpretation');
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
  return `You are an accessibility auditor. Analyze this automated finding and provide a structured interpretation.

Be concrete, non-alarmist, and actionable. Prefer specific fixes over generic advice.
If the WCAG mapping is unclear from the data, keep WCAG references general and set needsReview=true.

Page: ${pageUrl}
Description: ${finding.description}
WCAG: ${finding.wcagId ?? 'unknown'}
Impact: ${finding.impact ?? 'unknown'}
Selector: ${finding.selector ?? 'n/a'}
Snippet: ${finding.snippet ?? 'n/a'}

Use the submit_interpretation tool to provide your analysis.`;
}
