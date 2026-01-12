import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config.js';
import scanRoutes from './routes/scan.js';
import { logger } from './logger.js';
import { getDbHealthStatus } from './persistence.js';
import { getQueueHealthStatus } from './queue.js';

function getCorsOrigin(): boolean | string | string[] {
  const origin = env.ALLOWED_ORIGIN;
  if (!origin) {
    if (env.NODE_ENV === 'production') {
      logger.warn('ALLOWED_ORIGIN not set in production; CORS will reject cross-origin requests');
      return false;
    }
    return true; // Allow all origins in development
  }
  if (origin === '*') return true;
  // Support comma-separated list of origins
  if (origin.includes(',')) return origin.split(',').map((o) => o.trim());
  return origin;
}

function getRateLimitAllowList(): string[] {
  const allowList = env.RATE_LIMIT_ALLOW_LIST;
  if (allowList) {
    return allowList.split(',').map((ip) => ip.trim());
  }
  // In development, allow localhost to bypass rate limiting
  if (env.NODE_ENV === 'development') {
    return ['127.0.0.1', '::1'];
  }
  // In production, no bypass by default
  return [];
}

async function buildServer() {
  const app = Fastify({
    logger,
    bodyLimit: env.API_BODY_LIMIT,
    connectionTimeout: env.SCAN_TIMEOUT_MS
  });

  const corsOrigin = getCorsOrigin();
  await app.register(cors, { origin: corsOrigin });

  const rateLimitAllowList = getRateLimitAllowList();
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    allowList: rateLimitAllowList
  });

  logger.info(
    { corsOrigin: typeof corsOrigin === 'boolean' ? (corsOrigin ? '*' : 'none') : corsOrigin, rateLimitAllowList },
    'Security configuration'
  );

  app.get('/health', async () => {
    const db = getDbHealthStatus();
    const queue = getQueueHealthStatus();
    return {
      status: 'ok',
      env: env.NODE_ENV,
      components: {
        database: db.healthy ? 'healthy' : 'unhealthy',
        queue: queue.mode
      }
    };
  });

  await app.register(scanRoutes, { prefix: '/api' });
  return app;
}

async function start() {
  const app = await buildServer();
  const port = env.PORT ?? env.API_PORT;

  // Log memory usage at startup
  const mem = process.memoryUsage();
  logger.info({
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
    rss: Math.round(mem.rss / 1024 / 1024) + 'MB'
  }, 'Memory usage at startup');

  await app.listen({ port, host: env.API_HOST });
  logger.info(`API listening on http://${env.API_HOST}:${port}`);

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught exception');
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'Unhandled rejection');
  });
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});

export type AppServer = Awaited<ReturnType<typeof buildServer>>;

