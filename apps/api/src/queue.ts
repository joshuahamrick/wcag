import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { env } from './config.js';
import { executeScan } from './scanRunner.js';
import { logger } from './logger.js';
import { setStatus } from './store.js';

const useDirect = env.REDIS_URL === 'memory';
let connection: any = null;

if (!useDirect) {
  try {
    const RedisCtor: any = Redis as any;
    connection = new RedisCtor(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: false
    });
    if (connection) {
      connection.on('error', (err: unknown) => {
        logger.error({ err }, 'Redis unavailable, falling back to inline scans');
      });
    }
  } catch (err) {
    logger.error({ err }, 'Failed to init Redis; inline scans enabled');
    connection = null;
  }
}

type ScanJob = {
  scanId: string;
  siteUrl: string;
  maxPages?: number;
};

export const scanQueue =
  !useDirect && connection ? new Queue<ScanJob>('scan', { connection }) : null;

export const scanWorker =
  scanQueue && connection
    ? new Worker<ScanJob>(
        'scan',
        async (job) => {
          const { scanId, siteUrl, maxPages } = job.data;
          return executeScan(scanId, siteUrl, maxPages);
        },
        { connection }
      )
    : null;

if (scanWorker) {
  scanWorker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'scan completed');
  });

  scanWorker.on('failed', (job, err) => {
    if (job?.data?.scanId) setStatus(job.data.scanId, 'failed');
    logger.error({ err, jobId: job?.id }, 'scan job failed');
  });
}

export async function enqueueScan(scanId: string, siteUrl: string, maxPages?: number) {
  if (!scanQueue) {
    logger.warn({ siteUrl }, 'Queue unavailable; executing scan inline');
    return executeScan(scanId, siteUrl, maxPages);
  }

  await scanQueue.add('scan', { scanId, siteUrl, maxPages }, { attempts: 2, backoff: 5000 });
}

