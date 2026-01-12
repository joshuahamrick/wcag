# Web (Next.js)

Frontend for the WCAG Compliance Intelligence platform.

## Local dev (recommended)

From the repo root:

```bash
npm install
npm run dev:web
```

The app runs on `http://localhost:3000` and talks to the API via `NEXT_PUBLIC_API_BASE_URL`.

## Environment

Copy the example env file:

```bash
cp apps/web/env.example apps/web/.env.local
```

Key variable:
- `NEXT_PUBLIC_API_BASE_URL`: API base URL (default `http://localhost:4000`)

## Deploy (Vercel)

- Project root: `apps/web`
- Env:
  - `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
