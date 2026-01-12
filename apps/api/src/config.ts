import dotenv from 'dotenv';
import path from 'node:path';
import { z } from 'zod';

// Load .env from ENV_PATH if set, otherwise look in project root
const envPath = process.env.ENV_PATH || path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().optional(),
  API_PORT: z.coerce.number().default(4000),
  API_HOST: z.string().default('0.0.0.0'),
  API_BODY_LIMIT: z.coerce.number().default(64 * 1024),
  REDIS_URL: z.string().default('memory'),
  DATABASE_URL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default('claude-sonnet-4-20250514'),
  CLAUDE_MAX_TOKENS: z.coerce.number().default(1024),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  SCAN_MAX_PAGES: z.coerce.number().default(50),
  SCAN_TIMEOUT_MS: z.coerce.number().default(45000),
  PAGE_LOAD_TIMEOUT_MS: z.coerce.number().default(15000),
  PAGE_RETRY_COUNT: z.coerce.number().default(2),
  ALLOWED_ORIGIN: z.string().optional(),
  RATE_LIMIT_MAX: z.coerce.number().default(60),
  RATE_LIMIT_WINDOW: z.coerce.number().default(60_000),
  RATE_LIMIT_ALLOW_LIST: z.string().optional()
});

export const env = envSchema.parse(process.env);

