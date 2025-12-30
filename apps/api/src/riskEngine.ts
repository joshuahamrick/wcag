import { IssueRecord } from './types.js';

const weights = {
  LEGAL: 3,
  USABILITY: 2,
  BEST_PRACTICE: 1
} as const;

export function computeRiskScore(issues: IssueRecord[]): number {
  if (!issues.length) return 0;
  const total = issues.reduce((sum, issue) => sum + weights[issue.severity], 0);
  const max = issues.length * weights.LEGAL;
  const score = (total / max) * 100;
  return Math.min(100, Math.round(score));
}

