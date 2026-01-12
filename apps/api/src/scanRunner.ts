import { crawlSite } from './crawler.js';
import { interpretFindings } from './ai.js';
import { runAutomatedChecks } from './rulesEngine.js';
import { computeRiskScore } from './riskEngine.js';
import { saveIssues, setStatus, updateScan, getScan } from './store.js';
import { logger } from './logger.js';
import { ScanResult, BusinessType, StateComplianceInfo } from './types.js';
import { persistScan } from './persistence.js';
import { env } from './config.js';
import { storeSnapshots } from './storage.js';
import { assessStateRisk, getStateProfile } from './stateRequirements.js';

export interface ExecuteScanOptions {
  maxPages?: number;
  stateCode?: string;
  businessType?: BusinessType;
}

export async function executeScan(
  scanId: string,
  siteUrl: string,
  options: ExecuteScanOptions = {}
): Promise<ScanResult | undefined> {
  const { maxPages = 5, stateCode, businessType = 'other' } = options;
  setStatus(scanId, 'running');
  const startedAt = Date.now();
  const timings: Record<string, number> = {};

  logger.info({ scanId, siteUrl, maxPages, stateCode, businessType }, 'scan started');

  try {
    // Crawl phase
    const crawlStart = Date.now();
    const snapshots = await crawlSite(siteUrl, { maxPages, sameOriginOnly: true });
    timings.crawlMs = Date.now() - crawlStart;
    logger.info({ scanId, pageCount: snapshots.length, crawlMs: timings.crawlMs }, 'crawl completed');

    // Evidence storage phase
    const storageStart = Date.now();
    const evidenceByUrl = await storeSnapshots(snapshots, scanId);
    timings.storageMs = Date.now() - storageStart;
    const evidenceCount = [...evidenceByUrl.values()].filter((e) => e.screenshotKey || e.htmlKey).length;
    logger.info({ scanId, evidenceCount, storageMs: timings.storageMs }, 'evidence storage completed');

    // Rules engine phase
    const rulesStart = Date.now();
    const findings = await runAutomatedChecks(snapshots);
    timings.rulesMs = Date.now() - rulesStart;
    const findingCount = [...findings.values()].reduce((sum, f) => sum + f.length, 0);
    logger.info({ scanId, findingCount, rulesMs: timings.rulesMs }, 'rules engine completed');

    // AI interpretation phase
    const aiStart = Date.now();
    const interpreted = await interpretFindings(siteUrl, findings, evidenceByUrl);
    timings.aiMs = Date.now() - aiStart;
    logger.info({ scanId, issueCount: interpreted.length, aiMs: timings.aiMs }, 'AI interpretation completed');

    // Risk scoring
    const riskScore = computeRiskScore(interpreted);

    // State compliance assessment
    let stateCompliance: StateComplianceInfo | undefined;
    if (stateCode) {
      const criticalCount = interpreted.filter(i => i.severity === 'LEGAL').length;
      const assessment = assessStateRisk(stateCode, businessType, interpreted.length, criticalCount);
      if (assessment) {
        stateCompliance = {
          stateCode: assessment.state.code,
          stateName: assessment.state.name,
          riskLevel: assessment.riskLevel,
          estimatedExposure: assessment.estimatedExposure,
          demandLetterLikelihood: assessment.demandLetterLikelihood,
          applicableLaws: assessment.applicableRequirements.map(r => ({
            code: r.code,
            name: r.name,
            description: r.description,
            privateRightOfAction: r.privateRightOfAction,
            penalties: r.penalties.statutoryDamages || r.penalties.firstViolation
          })),
          priorityRemediations: assessment.priorityRemediations
        };
        logger.info(
          { scanId, stateCode, riskLevel: stateCompliance.riskLevel, demandLetterLikelihood: stateCompliance.demandLetterLikelihood },
          'state compliance assessment completed'
        );
      }
    }

    saveIssues(scanId, interpreted);
    const updated = updateScan(scanId, {
      status: 'completed',
      completedAt: new Date(),
      riskScore,
      pageCount: snapshots.length,
      stateCode,
      businessType,
      stateCompliance
    });

    if (updated) {
      await persistScan(updated);
    }

    const totalMs = Date.now() - startedAt;
    logger.info(
      { scanId, status: 'completed', pageCount: snapshots.length, issueCount: interpreted.length, riskScore, totalMs, timings },
      'scan completed successfully'
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const totalMs = Date.now() - startedAt;
    logger.error({ err, scanId, errorMessage, totalMs, timings }, 'scan execution failed');
    updateScan(scanId, { status: 'failed', errorMessage });
  }

  const elapsed = Date.now() - startedAt;
  if (elapsed > env.SCAN_TIMEOUT_MS) {
    logger.warn({ scanId, elapsed, timeout: env.SCAN_TIMEOUT_MS }, 'scan exceeded timeout budget');
  }

  return getScan(scanId);
}

