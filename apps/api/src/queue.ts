import { env } from './config.js';
import { executeScan } from './scanRunner.js';
import { logger } from './logger.js';
import { setStatus } from './store.js';
import { BusinessType } from './types.js';

const useDirect = env.REDIS_URL === 'memory';

// Lazy-load Redis/BullMQ only when actually using Redis
let scanQueue: any = null;
let scanWorker: any = null;
let connection: any = null;
let redisInitialized = false;

async function initRedis() {
  if (redisInitialized || useDirect) return;
  redisInitialized = true;

  try {
    const [{ Queue, Worker }, Redis] = await Promise.all([
      import('bullmq'),
      import('ioredis')
    ]);

    const RedisCtor: any = Redis.default;
    connection = new RedisCtor(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: false
    });

    connection.on('error', (err: unknown) => {
      logger.error({ err }, 'Redis unavailable, falling back to inline scans');
    });

    scanQueue = new Queue('scan', { connection });
    scanWorker = new Worker(
      'scan',
      async (job: any) => {
        const { scanId, siteUrl, maxPages, stateCode, businessType } = job.data;
        return executeScan(scanId, siteUrl, { maxPages, stateCode, businessType });
      },
      { connection }
    );

    scanWorker.on('completed', (job: any) => {
      logger.info({ jobId: job.id }, 'scan completed');
    });

    scanWorker.on('failed', (job: any, err: any) => {
      if (job?.data?.scanId) setStatus(job.data.scanId, 'failed');
      logger.error({ err, jobId: job?.id }, 'scan job failed');
    });

    logger.info('Redis queue initialized');
  } catch (err) {
    logger.error({ err }, 'Failed to init Redis; inline scans enabled');
  }
}

export async function enqueueScan(
  scanId: string,
  siteUrl: string,
  maxPages?: number,
  stateCode?: string,
  businessType?: BusinessType
) {
  if (useDirect) {
    logger.info({ siteUrl }, 'Using inline scan (memory mode)');
    return executeScan(scanId, siteUrl, { maxPages, stateCode, businessType });
  }

  await initRedis();

  if (!scanQueue) {
    logger.warn({ siteUrl }, 'Queue unavailable; executing scan inline');
    return executeScan(scanId, siteUrl, { maxPages, stateCode, businessType });
  }

  await scanQueue.add('scan', { scanId, siteUrl, maxPages, stateCode, businessType }, { attempts: 2, backoff: 5000 });
}

export function getQueueHealthStatus(): { mode: 'redis' | 'inline'; connected: boolean } {
  if (useDirect || !connection) {
    return { mode: 'inline', connected: false };
  }
  const connected = connection.status === 'ready';
  return { mode: 'redis', connected };
}
