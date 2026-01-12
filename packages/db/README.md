# DB (Prisma)

This package contains the Prisma schema and (optionally) the generated client used by the API for persistence.

## Generate Prisma client

From the repo root:

```bash
npx prisma generate --schema=packages/db/prisma/schema.prisma
```

## Migrations

Migrations are not committed yet (schema may still be evolving). When ready, you can create one with:

```bash
npx prisma migrate dev --schema=packages/db/prisma/schema.prisma
```

## Connection

Set `DATABASE_URL` for the API (example for local Docker Postgres):

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wcag
```


