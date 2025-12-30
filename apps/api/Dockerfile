FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
RUN npm install

# Build API
COPY . .
RUN npm run build --workspace apps/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]

