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
  description: 'Submit the structured accessibility interpretation for a WCAG finding',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: {
        type: 'string',
        description: 'Concise issue title (5-10 words). Include the WCAG criterion number if known. Example: "Missing alt text on hero image (WCAG 1.1.1)"'
      },
      explanation: {
        type: 'string',
        description: 'Plain-language explanation (2-3 sentences). Describe what the issue is, who it affects (blind users, keyboard users, etc.), and why it matters. Avoid jargon.'
      },
      recommendation: {
        type: 'string',
        description: 'Specific fix instructions. Reference the exact element from the selector/snippet. Example: "Add alt=\"Company logo - AcmeCorp\" to the <img> element in the header navigation."'
      },
      risk: {
        type: 'string',
        enum: ['LEGAL', 'USABILITY', 'BEST_PRACTICE'],
        description: 'LEGAL = common lawsuit trigger (alt text, contrast, keyboard, form labels, ARIA). USABILITY = impacts users but rarely litigated. BEST_PRACTICE = minor enhancement.'
      },
      confidence: {
        type: 'number',
        description: 'How certain you are (0-1). Use 0.9+ for clear violations with evidence, 0.7-0.9 for likely issues, 0.5-0.7 for probable issues needing verification.'
      },
      needsReview: {
        type: 'boolean',
        description: 'Set true if: confidence < 0.7, the fix requires understanding page context, or multiple valid interpretations exist.'
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

  // Generate more specific recommendations based on common patterns
  let recommendation = 'Review this element for WCAG compliance.';
  const desc = finding.description?.toLowerCase() ?? '';
  const wcag = finding.wcagId?.toLowerCase() ?? '';

  if (desc.includes('alt') || wcag.includes('1.1.1') || wcag.includes('111')) {
    recommendation = 'Add descriptive alt text to this image that conveys its meaning or purpose. If decorative, use alt="".';
  } else if (desc.includes('contrast') || wcag.includes('1.4.3') || wcag.includes('143')) {
    recommendation = 'Increase the color contrast ratio to at least 4.5:1 for normal text or 3:1 for large text. Use a contrast checker tool.';
  } else if (desc.includes('keyboard') || wcag.includes('2.1.1') || wcag.includes('211')) {
    recommendation = 'Ensure this element can be accessed and activated using only a keyboard. Add tabindex if needed and handle Enter/Space key events.';
  } else if (desc.includes('label') || desc.includes('form') || wcag.includes('1.3.1') || wcag.includes('131')) {
    recommendation = 'Associate a visible <label> element with this form control using the "for" attribute, or add aria-label/aria-labelledby.';
  } else if (desc.includes('heading') || wcag.includes('2.4.6') || wcag.includes('246')) {
    recommendation = 'Use proper heading hierarchy (h1-h6). Ensure headings are descriptive and follow a logical order without skipping levels.';
  } else if (desc.includes('link') || wcag.includes('2.4.4') || wcag.includes('244')) {
    recommendation = 'Make link text descriptive of its destination. Avoid generic text like "click here" or "read more" without context.';
  } else if (desc.includes('aria') || wcag.includes('4.1.2') || wcag.includes('412')) {
    recommendation = 'Ensure this element has an accessible name and appropriate ARIA role. Use aria-label, aria-labelledby, or native HTML semantics.';
  } else if (desc.includes('lang') || wcag.includes('3.1.1') || wcag.includes('311')) {
    recommendation = 'Add a lang attribute to the <html> element specifying the page language (e.g., lang="en" for English).';
  }

  // Create a cleaner title
  const title = finding.help || finding.description?.slice(0, 80) || 'Accessibility issue detected';

  return {
    title,
    explanation: finding.description || 'An accessibility issue was detected by automated testing tools. Manual review is recommended.',
    recommendation,
    risk,
    confidence: 0.5,
    needsReview: true
  };
}

function guessSeverity(finding: AutomatedFinding): IssueSeverity {
  const impact = finding.impact?.toLowerCase() ?? '';
  const desc = finding.description?.toLowerCase() ?? '';
  const wcag = finding.wcagId?.toLowerCase() ?? '';
  const tags = finding.tags?.map(t => t.toLowerCase()) ?? [];

  // High-litigation WCAG criteria - these commonly trigger lawsuits
  const legalCriteria = ['1.1.1', '111', '1.4.3', '143', '2.1.1', '211', '2.1.2', '212',
                         '1.3.1', '131', '3.3.2', '332', '4.1.2', '412', '2.4.2', '242', '3.1.1', '311'];

  // Check if this matches a high-litigation criterion
  for (const criteria of legalCriteria) {
    if (wcag.includes(criteria)) return 'LEGAL';
  }

  // Check for common lawsuit-trigger keywords
  if (desc.includes('alt text') || desc.includes('alternative text') ||
      desc.includes('contrast') || desc.includes('keyboard') ||
      desc.includes('form label') || desc.includes('missing label') ||
      desc.includes('aria-label') || desc.includes('accessible name')) {
    return 'LEGAL';
  }

  // Check axe-core tags for WCAG A/AA level issues
  if (tags.some(t => t.includes('wcag2a') || t.includes('wcag21a'))) {
    // Level A issues are more likely to be legal risks
    if (impact.includes('critical') || impact.includes('serious')) return 'LEGAL';
    return 'USABILITY';
  }

  // Fall back to impact-based classification
  if (impact.includes('critical') || impact.includes('serious')) return 'LEGAL';
  if (impact.includes('moderate')) return 'USABILITY';
  return 'BEST_PRACTICE';
}

function buildPrompt(finding: AutomatedFinding, pageUrl: string): string {
  // Map common WCAG codes to human-readable criteria
  const wcagDescriptions: Record<string, string> = {
    'wcag111': '1.1.1 Non-text Content - Images need alt text',
    'wcag121': '1.2.1 Audio/Video Alternatives',
    'wcag131': '1.3.1 Info and Relationships - Proper HTML structure',
    'wcag141': '1.4.1 Use of Color - Don\'t rely solely on color',
    'wcag143': '1.4.3 Contrast (Minimum) - 4.5:1 ratio required',
    'wcag144': '1.4.4 Resize Text - Must work at 200% zoom',
    'wcag211': '2.1.1 Keyboard - All functionality via keyboard',
    'wcag212': '2.1.2 No Keyboard Trap',
    'wcag241': '2.4.1 Bypass Blocks - Skip navigation links',
    'wcag242': '2.4.2 Page Titled - Descriptive page titles',
    'wcag244': '2.4.4 Link Purpose - Clear link text',
    'wcag246': '2.4.6 Headings and Labels - Descriptive headings',
    'wcag251': '2.5.1 Pointer Gestures',
    'wcag311': '3.1.1 Language of Page - lang attribute',
    'wcag321': '3.2.1 On Focus - No unexpected context changes',
    'wcag331': '3.3.1 Error Identification',
    'wcag332': '3.3.2 Labels or Instructions',
    'wcag411': '4.1.1 Parsing - Valid HTML',
    'wcag412': '4.1.2 Name, Role, Value - ARIA/form labels'
  };

  const wcagCode = finding.wcagId?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
  const wcagContext = wcagDescriptions[wcagCode] || finding.wcagId || 'unknown';

  return `You are an expert WCAG 2.1 accessibility auditor helping businesses avoid ADA lawsuits. Analyze this automated finding and provide a structured interpretation.

## Guidelines

**Severity Classification:**
- LEGAL: Issues that commonly trigger ADA lawsuits or demand letters. These include:
  - Missing alt text on images (1.1.1)
  - Insufficient color contrast (1.4.3)
  - Keyboard inaccessibility (2.1.1, 2.1.2)
  - Missing form labels (1.3.1, 3.3.2, 4.1.2)
  - Missing page titles or language attributes (2.4.2, 3.1.1)
  - Inaccessible buttons/links for screen readers (4.1.2)

- USABILITY: Issues that significantly impact disabled users but are less commonly litigated:
  - Poor heading structure
  - Missing skip links
  - Focus indicator issues
  - Complex gesture requirements

- BEST_PRACTICE: Minor improvements that enhance accessibility but rarely cause legal issues

**Confidence Scoring:**
- 0.9-1.0: Clear-cut violation with specific evidence
- 0.7-0.9: Likely violation, minor ambiguity
- 0.5-0.7: Probable issue, needs human verification
- Below 0.5: Uncertain, definitely needs review

**Recommendations should be:**
- Specific to the exact element (use the selector/snippet)
- Include the actual fix, not just "add alt text" but "add alt text describing [what's likely in the image based on context]"
- Mention the WCAG success criterion

## Finding to Analyze

Page: ${pageUrl}
Description: ${finding.description}
WCAG Criterion: ${wcagContext}
Impact Level: ${finding.impact ?? 'unknown'}
CSS Selector: ${finding.selector ?? 'n/a'}
HTML Snippet: ${finding.snippet ?? 'n/a'}
Tool Tags: ${finding.tags?.join(', ') ?? 'n/a'}

Use the submit_interpretation tool to provide your analysis. Be concrete and actionable.`;
}
