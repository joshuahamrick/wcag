import { randomUUID } from 'node:crypto';
import { ScanResult, IssueRecord, ScanStatus } from './types.js';

const scans = new Map<string, ScanResult>();

export function createScan(siteUrl: string): ScanResult {
  const scan: ScanResult = {
    id: randomUUID(),
    siteUrl,
    status: 'pending',
    issues: [],
    startedAt: new Date(),
    pageCount: 0
  };
  scans.set(scan.id, scan);
  return scan;
}

export function updateScan(
  id: string,
  updates: Partial<Omit<ScanResult, 'id' | 'siteUrl' | 'issues'>> & {
    issues?: IssueRecord[];
  }
): ScanResult | undefined {
  const current = scans.get(id);
  if (!current) return undefined;
  const next: ScanResult = {
    ...current,
    ...updates,
    issues: updates.issues ?? current.issues
  };
  scans.set(id, next);
  return next;
}

export function saveIssues(scanId: string, issues: IssueRecord[]): void {
  const scan = scans.get(scanId);
  if (!scan) return;
  scan.issues = issues;
  scan.pageCount = Math.max(scan.pageCount, new Set(issues.map((i) => i.pageUrl)).size);
  scans.set(scanId, scan);
}

export function setStatus(scanId: string, status: ScanStatus): void {
  const scan = scans.get(scanId);
  if (!scan) return;
  scan.status = status;
  if (status === 'completed' || status === 'failed') {
    scan.completedAt = new Date();
  }
  scans.set(scanId, scan);
}

export function getScan(id: string): ScanResult | undefined {
  return scans.get(id);
}

