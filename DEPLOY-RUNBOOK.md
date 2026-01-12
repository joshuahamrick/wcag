# WCAG Compliance Platform — Deploy Runbook (Preview)

## Overview
- Frontend: Next.js (App Router) — deploy on Vercel.
- Backend: Fastify API — deploy on AWS ECS Fargate (or similar), with Redis (Elasticache), Postgres (RDS), S3-compatible storage.
- Queue: BullMQ with Redis.
- Storage: S3 bucket for snapshots/reports (future use).

## Required Env Vars
See `config/env.example` for the full list. Key runtime values:
- `API_HOST=0.0.0.0`
- `API_PORT=4000`
- `API_BODY_LIMIT=65536`
- `REDIS_URL=redis://<redis-host>:6379`
- `DATABASE_URL=postgresql://user:pass@host:5432/wcag`
- `ANTHROPIC_API_KEY=<optional for richer AI interpretations via Claude>`
- `S3_ENDPOINT=https://s3.amazonaws.com` (or your S3-compatible endpoint)
- `S3_REGION=us-east-1`
- `S3_ACCESS_KEY_ID=<key>`
- `S3_SECRET_ACCESS_KEY=<secret>`
- `S3_BUCKET=wcag-artifacts`
- `ALLOWED_ORIGIN=https://your-frontend-domain`
- `SCAN_MAX_PAGES=50` (adjust per plan)
- `SCAN_TIMEOUT_MS=45000`

## Build Artifacts
- API: `npm run build --workspace apps/api` produces `apps/api/dist`.
- Web: `npm run build --workspace apps/web` produces `.next` output.
- Prisma: `npx prisma generate --schema=packages/db/prisma/schema.prisma` (run at build time or entrypoint).
- Migrations: when schema changes, add Prisma migrations and run before deploying API.

## Vercel (Web)
1) Set project root to `apps/web`.
2) Set env `NEXT_PUBLIC_API_BASE_URL` to the public API base (e.g., `https://api.yourdomain.com`).
3) `npm install` (monorepo) then `npm run build --workspace apps/web`.

## ECS/Fargate (API)
1) Build image from `apps/api`:
   - `docker build -t wcag-api -f apps/api/Dockerfile .`
2) Run task definition with:
   - Env vars above.
   - CPU/memory sized for Playwright + node (e.g., 1 vCPU / 2GB+).
   - Health check on `GET /health`.
3) Networking:
   - Allow outbound HTTPS.
   - Security group to Redis/Postgres/S3.

## Redis (Elasticache)
- Minimum: 1 node, small instance.
- Security: restrict to API task SG.

## Postgres (RDS)
- Set `DATABASE_URL`.
- Run migrations when added (Prisma).

## S3
- Create bucket `wcag-artifacts`.
- Grant `PutObject`/`GetObject` for the API IAM role.

## SSL/TLS
- Terminate TLS at load balancer / Vercel.
- Ensure outbound TLS validation enabled (do not set `NODE_TLS_REJECT_UNAUTHORIZED=0` in prod).

## Logs/Monitoring
- Capture API stdout (pino) in CloudWatch.
- Add alarms on 5xx, queue depth, and task CPU/mem.

## Operations
- Start API: `node dist/index.js`.
- Health: `GET /health`.
- Key endpoints:
  - `POST /api/scans` (start scan)
  - `GET /api/scans/:id`
  - `GET /api/scans/:id/export`
  - `GET /api/scans/:id/report.pdf`

## Risks / To Improve
- Next.js security advisory on 14.2.11 — upgrade when patched release is available.
- Prisma migrations to be added when schema is finalized.
- S3 persistence currently not wired; evidence is in-memory for now. Enable and test before storing artifacts for customers.
- Inline queue mode (`REDIS_URL=memory`) is for local only; use Redis in production.
- Replace draft ToS/Privacy text with counsel-approved language before launch.

