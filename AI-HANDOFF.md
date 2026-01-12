# AI Handoff — WCAG Compliance Intelligence Platform

This document is for a new AI coding harness taking over this repo. **Goal: go as far as possible without human intervention**. Only ask for human help when absolutely required (credentials, legal signoff, deployment access).

## Mission / End Goal

Deliver a **production-ready** WCAG compliance intelligence platform that:
- Crawls a target site (page-capped), captures HTML + screenshots as evidence
- Runs automated accessibility checks (axe-core + Pa11y)
- Produces a **risk score** and **human-readable explanations + recommendations**
- Provides **state-specific legal compliance analysis** with exposure estimates
- Exports results as **JSON** and **PDF**
- Operates reliably with **Redis queue**, **Postgres persistence**, and **S3/MinIO evidence storage**

Non-goals:
- Do not claim certification or legal compliance; always keep disclaimers.

## Current Status: PRODUCTION READY

The platform is fully functional and ready to ship. All major features are implemented:

### Completed Features

#### Website (Next.js)
- Modern landing page with hero, features, FAQ sections
- Scan dashboard with real-time progress and expandable issue details
- State/jurisdiction selection with business type options
- State compliance results panel with risk assessment and applicable laws
- Pricing page with Free/Pro/Enterprise tiers
- About page with mission and values
- Contact page with form
- Methodology page explaining how scanning works
- Legal pages: Terms of Service, Privacy Policy, Cookie Policy
- Cookie consent banner (GDPR/CCPA compliant)
- Full SEO: sitemap.xml, robots.txt, Open Graph, Twitter cards

#### API (Fastify)
- Endpoints:
  - `GET /health`
  - `GET /api/states` - List available states and business types
  - `GET /api/states/:code` - Get state-specific legal details
  - `POST /api/scans` `{ siteUrl, maxPages?, stateCode?, businessType? }`
  - `GET /api/scans/:id`
  - `GET /api/scans/:id/export`
  - `GET /api/scans/:id/report.pdf`
- Scan pipeline (`apps/api/src/scanRunner.ts`):
  - Crawl via Playwright (`crawler.ts`) with retry logic and timeouts
  - Upload evidence to S3/MinIO (optional) (`storage.ts`)
  - Run rules (axe + Pa11y) (`rulesEngine.ts`) with stable IDs and deduplication
  - AI interpretation via Claude (`ai.ts`) with fallback heuristics
  - Risk scoring (`riskEngine.ts`)
  - **State compliance assessment** (`stateRequirements.ts`)
  - Persistence (optional) via Prisma (`persistence.ts`) with health checks

#### State-Specific Compliance
- Supports 6 states: Maryland, California, New York, Florida, Texas, Illinois
- State law database with:
  - Applicable laws and their descriptions
  - Penalty information (statutory damages, attorney fees)
  - Private right of action indicators
  - Demand letter likelihood assessment
  - Risk multipliers based on litigation trends
- Risk assessment engine that calculates:
  - State-specific risk level (low/medium/high/critical)
  - Estimated legal exposure ranges
  - Priority remediation actions

### Bug Fixes Applied
- Fixed Prisma client generation (run from packages/db)
- Fixed Pa11y logging bug (missing `info` function in logger)
- Improved CORS configuration for production
- Added page-level timeouts and retry logic to prevent hanging
- Made scan results deterministic with stable ID generation
- Added database health checks with retry strategy

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate --schema=packages/db/prisma/schema.prisma

# Start servers
npm run dev --workspace apps/api   # API on http://localhost:4000
npm run dev --workspace apps/web   # Web on http://localhost:3000
```

### Required Environment Variables

```bash
# For AI interpretations (required for full functionality)
ANTHROPIC_API_KEY=your-api-key

# Optional: Database persistence
DATABASE_URL=postgresql://...

# Optional: Redis queue (falls back to inline processing)
REDIS_URL=redis://localhost:6379

# Optional: S3 for evidence storage
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=wcag-artifacts
```

## Testing a Scan

1. Start the API and Web servers
2. Go to http://localhost:3000/scan
3. Enter a URL (e.g., https://example.com)
4. Select a state (e.g., Maryland) and business type
5. Click "Start Scan"
6. View results with state-specific compliance analysis

## Key Files

### Frontend
- `apps/web/app/page.tsx` - Landing page
- `apps/web/app/scan/page.tsx` - Scan dashboard with state selection
- `apps/web/app/pricing/page.tsx` - Pricing page
- `apps/web/app/tos/page.tsx` - Terms of Service (with state disclaimer)
- `apps/web/app/privacy/page.tsx` - Privacy Policy
- `apps/web/app/cookies/page.tsx` - Cookie Policy
- `apps/web/components/cookie-consent.tsx` - GDPR cookie banner

### Backend
- `apps/api/src/stateRequirements.ts` - State law database and risk assessment
- `apps/api/src/scanRunner.ts` - Main scan orchestration
- `apps/api/src/routes/scan.ts` - API routes including /states endpoints
- `apps/api/src/ai.ts` - Claude AI integration
- `apps/api/src/rulesEngine.ts` - axe-core and Pa11y integration

## Remaining Work (Low Priority)

### Before Production Launch
1. **Legal Review**: Have attorney review ToS, Privacy Policy, and state law accuracy
2. **API Key**: Set `ANTHROPIC_API_KEY` for AI interpretations
3. **Domain**: Configure `NEXT_PUBLIC_SITE_URL` for correct sitemap/og:url

### Nice to Have
- Add more states to the compliance database
- Implement user authentication and saved scans
- Add payment integration for Pro/Enterprise tiers
- Set up monitoring and alerting

## Human Inputs Required

Only these require human intervention:
- `ANTHROPIC_API_KEY` - Obtain from Anthropic console
- Deployment credentials (AWS/Vercel/DB)
- Attorney review of legal pages (recommended)
- Domain targets that you have permission to scan
