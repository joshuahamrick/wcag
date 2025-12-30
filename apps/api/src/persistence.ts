import { ScanResult } from './types.js';
import { logger } from './logger.js';

type PrismaClient = import('@prisma/client').PrismaClient;

let prisma: PrismaClient | null = null;
let dbHealthy = true;

async function ensureDb() {
  if (!dbHealthy) return false;
  try {
    if (!prisma) {
      const mod = await import('@prisma/client');
      prisma = new mod.PrismaClient();
    }
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    logger.warn({ err }, 'database unavailable, falling back to memory store');
    dbHealthy = false;
    return false;
  }
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

