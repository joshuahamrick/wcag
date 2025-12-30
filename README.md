# WCAG Compliance Intelligence – Status & Next Steps

## Current Position
- **MVP built**: Next.js web UI, Fastify API, Playwright crawler, axe/Pa11y rules, AI interpretation, risk scoring, PDF/JSON exports.
- **Operational hardening**: Rate limiting, request limits, health endpoint, disclaimers in UI/PDF, methodology/ToS/Privacy pages, API Dockerfile, deployment runbook.
- **Storage**: Optional S3 upload for screenshots/HTML snapshots (env‑guarded). Persistence to DB is pluggable via Prisma but not exercised locally.
- **Queues**: BullMQ with Redis; inline fallback when Redis is unavailable.
- **Tests/builds**: `npm run lint`, `npm run build --workspace apps/api`, `npm run build --workspace apps/web`, `npm run typecheck -w apps/api` all green.
- **E2E smoke (inline)**: Scans https://example.com successfully; PDF/JSON endpoints OK. Queue/DB not validated due to lack of Docker/infra on this host.

## Goals & Trajectory
1) **Production-like E2E** with Redis + Postgres + S3 to validate queue, persistence, and artifact uploads; capture PDF/JSON artifacts.
2) **Finalize legal**: Replace draft ToS/Privacy text with counsel-approved language.
3) **Security**: Upgrade Next.js beyond 14.2.11 when patched; ensure strict TLS in installs/CI (relaxed locally due to cert issues).
4) **Persistence choices**: Either keep exports-only (in-memory) or enable Postgres + S3 for stored evidence; add migrations as schema settles.

## How to Run Locally (no Docker)
```
npm install
npx prisma generate --schema=packages/db/prisma/schema.prisma   # optional if DB used
npm run dev --workspace apps/api   # API on default envs
npm run dev --workspace apps/web   # Web
```
Set `ENV_PATH` to a file (e.g., `.env`) if you want non-default envs.

## Proposed E2E With Docker (when available)
1) Create `.env.e2e` with API/Redis/Postgres/S3 vars (see `config/env.example`).
2) Run `docker compose -f docker-compose.e2e.yml up -d` (Redis, Postgres, MinIO).
3) Create S3 bucket in MinIO (`wcag-artifacts`).
4) `npx prisma generate --schema=packages/db/prisma/schema.prisma`.
5) Start API with `.env.e2e`; run a scan against `https://example.com`.
6) Fetch PDF/JSON; verify S3 uploads in MinIO console.

## Key Files
- `apps/web/app/page.tsx` – main UI, links to Methodology/ToS/Privacy.
- `apps/web/app/methodology|tos|privacy` – legal/methodology copy (draft).
- `apps/api/src/index.ts` – Fastify setup, health, rate limit, CORS.
- `apps/api/src/routes/scan.ts` – scan start/status/export/report endpoints.
- `apps/api/src/scanRunner.ts` – crawl, rules, AI, risk scoring, persistence hooks.
- `apps/api/src/storage.ts` – optional S3 artifact upload.
- `DEPLOY-RUNBOOK.md` – Vercel + ECS/Fargate + RDS/Redis/S3 guidance.
- `apps/api/Dockerfile` – build/run API container.

## Outstanding Risks/Work
- Next.js security advisory (14.2.11) pending upgrade.
- S3/Redis/Postgres not validated locally; needs a Docker-capable host or cloud.
- Draft legal text must be finalized by counsel.
- TLS was relaxed for installs here; re-enable strict TLS in real environments.

