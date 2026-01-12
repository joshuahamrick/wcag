import { ScanResult } from './types.js';
import { logger } from './logger.js';
import { env } from './config.js';

type PrismaClient = import('@prisma/client').PrismaClient;

let prisma: PrismaClient | null = null;
let dbHealthy = true;
let lastHealthCheckTime = 0;
let consecutiveFailures = 0;

const DB_HEALTH_CHECK_INTERVAL_MS = 30000; // Re-check DB health every 30 seconds after failure
const DB_MAX_RETRIES = 3;
const DB_RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function connectWithRetry(): Promise<boolean> {
  for (let attempt = 1; attempt <= DB_MAX_RETRIES; attempt++) {
    try {
      if (!prisma) {
        const mod = await import('@prisma/client');
        prisma = new mod.PrismaClient();
      }
      await prisma.$queryRaw`SELECT 1`;
      if (consecutiveFailures > 0) {
        logger.info({ previousFailures: consecutiveFailures }, 'database connection restored');
      }
      consecutiveFailures = 0;
      return true;
    } catch (err) {
      const isLastAttempt = attempt === DB_MAX_RETRIES;
      logger.warn(
        { err, attempt, maxRetries: DB_MAX_RETRIES },
        isLastAttempt ? 'database connection failed after retries' : 'database connection failed, retrying'
      );
      if (!isLastAttempt) {
        await sleep(DB_RETRY_DELAY_MS * attempt);
      }
    }
  }
  consecutiveFailures++;
  return false;
}

async function ensureDb(): Promise<boolean> {
  // If DATABASE_URL is not set, skip DB entirely
  if (!env.DATABASE_URL) {
    return false;
  }

  // If DB was marked unhealthy, periodically retry
  if (!dbHealthy) {
    const now = Date.now();
    if (now - lastHealthCheckTime < DB_HEALTH_CHECK_INTERVAL_MS) {
      return false;
    }
    lastHealthCheckTime = now;
    logger.debug('attempting to reconnect to database');
  }

  const connected = await connectWithRetry();
  dbHealthy = connected;
  lastHealthCheckTime = Date.now();
  return connected;
}

export function getDbHealthStatus(): { healthy: boolean; consecutiveFailures: number } {
  return { healthy: dbHealthy, consecutiveFailures };
}

export async function persistScan(scan: ScanResult) {
  const ready = await ensureDb();
  if (!ready || !prisma) return;

  try {
    await prisma.scan.upsert({
      where: { id: scan.id },
      create: {
        id: scan.id,
        siteId: scan.siteUrl,
        status: scan.status.toUpperCase() as any,
        startedAt: scan.startedAt,
        completedAt: scan.completedAt,
        pageCount: scan.pageCount,
        riskScore: scan.riskScore
      },
      update: {
        status: scan.status.toUpperCase() as any,
        completedAt: scan.completedAt,
        pageCount: scan.pageCount,
        riskScore: scan.riskScore
      }
    });
  } catch (err) {
    logger.error({ err }, 'failed to persist scan');
  }
}

