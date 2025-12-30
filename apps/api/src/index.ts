import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config.js';
import scanRoutes from './routes/scan.js';
import { logger } from './logger.js';
import './queue.js';

async function buildServer() {
  const app = Fastify({
    logger,
    bodyLimit: env.API_BODY_LIMIT,
    connectionTimeout: env.SCAN_TIMEOUT_MS
  });

  await app.register(cors, { origin: env.ALLOWED_ORIGIN ?? true });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    allowList: ['127.0.0.1']
  });

  app.get('/health', async () => ({
    status: 'ok',
    env: env.NODE_ENV
  }));

  await app.register(scanRoutes, { prefix: '/api' });
  return app;
}

async function start() {
  const app = await buildServer();
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
  logger.info(`API listening on http://${env.API_HOST}:${env.API_PORT}`);

  const shutdown = async () => {
    logger.info('Shutting down API');
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});

export type AppServer = Awaited<ReturnType<typeof buildServer>>;

