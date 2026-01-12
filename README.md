# ADACheck - WCAG Compliance Intelligence Platform

A comprehensive web accessibility scanning platform that identifies WCAG 2.1 violations, provides AI-powered recommendations, and includes state-specific legal compliance analysis.

## Features

### Core Scanning
- **Automated WCAG 2.1 AA Testing**: Uses axe-core and Pa11y for comprehensive accessibility checks
- **AI-Powered Interpretations**: Claude-powered analysis for context-aware recommendations
- **Risk Scoring**: Prioritized findings with legal, usability, and best practice categorization
- **Evidence Collection**: Screenshots and HTML snapshots for documentation
- **Export Options**: PDF reports and JSON data exports

### State-Specific Compliance (NEW)
- **Jurisdiction Selection**: Choose from multiple US states for localized compliance analysis
- **State Law Integration**: Includes Maryland, California, New York, Florida, Texas, Illinois
- **Legal Exposure Estimates**: Risk assessment based on state-specific penalties
- **Demand Letter Likelihood**: Litigation risk indicators based on state trends
- **Applicable Laws Display**: Shows relevant state laws with penalty information

### Website
- **Modern Landing Page**: Professional marketing site with hero, features, FAQ
- **Scan Dashboard**: Real-time scanning progress with expandable issue details
- **Pricing Page**: Free, Pro, and Enterprise tiers
- **Legal Pages**: GDPR/CCPA compliant Privacy Policy, Terms of Service, Cookie Policy
- **SEO Optimized**: Sitemap, robots.txt, Open Graph, structured metadata

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Fastify, TypeScript
- **Scanning**: Playwright, axe-core, Pa11y
- **AI**: Anthropic Claude API (with fallback heuristics)
- **Queue**: BullMQ with Redis (inline fallback available)
- **Database**: PostgreSQL with Prisma (optional)
- **Storage**: S3/MinIO for evidence artifacts (optional)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client (if using database)
npx prisma generate --schema=packages/db/prisma/schema.prisma

# Start development servers
npm run dev --workspace apps/api   # API on http://localhost:4000
npm run dev --workspace apps/web   # Web on http://localhost:3000
```

### Environment Variables

Copy `config/env.example` to `.env` and configure:

```bash
# Required for AI interpretations
ANTHROPIC_API_KEY=your-api-key

# Optional: Database
DATABASE_URL=postgresql://...

# Optional: Redis for queuing
REDIS_URL=redis://localhost:6379

# Optional: S3 for evidence storage
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=wcag-artifacts
```

## API Endpoints

### Scan Operations
- `POST /api/scans` - Start a new scan
  - Body: `{ siteUrl, maxPages?, stateCode?, businessType? }`
- `GET /api/scans/:id` - Get scan status and results
- `GET /api/scans/:id/export` - Download JSON export
- `GET /api/scans/:id/report.pdf` - Download PDF report

### State Information
- `GET /api/states` - List available states and business types
- `GET /api/states/:code` - Get state-specific legal details

### Health
- `GET /health` - API health check

## Supported States

| State | Risk Level | Key Laws |
|-------|------------|----------|
| California | High | Unruh Civil Rights Act ($4,000+ per violation) |
| New York | High | NY Human Rights Law |
| Maryland | Medium | Online Information and Services Act |
| Florida | Medium | Florida Civil Rights Act |
| Illinois | Medium | IL Information Technology Accessibility Act |
| Texas | Low | TX Administrative Code |

## Production Deployment

See `DEPLOY-RUNBOOK.md` for comprehensive deployment guidance:
- Vercel for Next.js frontend
- AWS ECS/Fargate for API
- RDS PostgreSQL for persistence
- ElastiCache Redis for queuing
- S3 for evidence storage

## Legal Disclaimer

This service provides automated accessibility scanning and informational guidance. **It does not constitute legal advice.** State compliance assessments are based on publicly available information and should be verified with qualified legal counsel. Automated testing identifies approximately 30-40% of accessibility issues; manual testing is recommended for full compliance.

## Contributing

This project is currently in active development. See `AI-HANDOFF.md` for implementation details and outstanding work.

## License

Proprietary - All rights reserved
