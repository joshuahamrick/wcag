# API (Fastify)

Backend API for crawling a site, running automated accessibility checks, optionally enriching findings with AI, and exporting results as JSON/PDF.

## Local dev (no Docker)

From the repo root:

```bash
npm install
npm run dev:api
```

API defaults to `http://0.0.0.0:4000`.

### Using a custom env file

The API supports `ENV_PATH`:

```bash
ENV_PATH=/absolute/path/to/.env npm run dev:api
```

## E2E infra with Docker (Redis + Postgres + MinIO)

This repo includes a docker compose file that brings up **Redis**, **Postgres**, and **MinIO**.

1) Start infra (from repo root):

```bash
docker compose -f docker-compose.e2e.yml up -d
```

2) Use an env file that targets those services (example):

- Copy `config/env.e2e.example` somewhere as `.env.e2e`
- Start the API with:

```bash
ENV_PATH=/absolute/path/to/.env.e2e npm run dev:api
```

Notes:
- MinIO console is `http://localhost:9001` (default user/pass `minioadmin` / `minioadmin`)
- The compose file auto-creates the `wcag-artifacts` bucket via `minio-init`

## Endpoints

- `GET /health`: health check
- `POST /api/scans`: start a scan
  - body: `{ "siteUrl": "https://example.com", "maxPages": 10 }`
- `GET /api/scans/:id`: scan status/result
- `GET /api/scans/:id/export`: JSON export
- `GET /api/scans/:id/report.pdf`: PDF report download

## Queue + persistence behavior

- **Redis queue**
  - If `REDIS_URL=memory` or Redis is unavailable, scans run inline in the API process.
- **Postgres (Prisma)**
  - If `DATABASE_URL` is unset/unreachable, the API logs a warning and continues using the in-memory store.
- **S3/MinIO artifacts**
  - If S3 env vars are set, page screenshots/HTML are uploaded and referenced as evidence in results.


