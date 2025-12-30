import { crawlSite } from './crawler.js';
import { interpretFindings } from './ai.js';
import { runAutomatedChecks } from './rulesEngine.js';
import { computeRiskScore } from './riskEngine.js';
import { saveIssues, setStatus, updateScan, getScan } from './store.js';
import { logger } from './logger.js';
import { ScanResult } from './types.js';
import { persistScan } from './persistence.js';
import { env } from './config.js';
import { storeSnapshots } from './storage.js';

export async function executeScan(
  scanId: string,
  siteUrl: string,
  maxPages = 5
): Promise<ScanResult | undefined> {
  setStatus(scanId, 'running');
  const startedAt = Date.now();
  try {
    const snapshots = await crawlSite(siteUrl, { maxPages, sameOriginOnly: true });
    const evidenceByUrl = await storeSnapshots(snapshots, scanId);
    const findings = await runAutomatedChecks(snapshots);
    const interpreted = await interpretFindings(siteUrl, findings, evidenceByUrl);
    const riskScore = computeRiskScore(interpreted);

    saveIssues(scanId, interpreted);
    const updated = updateScan(scanId, {
      status: 'completed',
      completedAt: new Date(),
      riskScore,
      pageCount: snapshots.length
    });

    if (updated) {
      await persistScan(updated);
    }
  } catch (err) {
    logger.error({ err, scanId }, 'scan execution failed');
    updateScan(scanId, { status: 'failed' });
  }

  const elapsed = Date.now() - startedAt;
  if (elapsed > env.SCAN_TIMEOUT_MS) {
    logger.warn({ scanId, elapsed }, 'scan exceeded timeout budget');
  }

  return getScan(scanId);
}

