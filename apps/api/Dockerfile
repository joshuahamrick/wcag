FROM node:20-alpine

WORKDIR /app

# Copy package files from apps/api (Docker context is repo root)
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy source
COPY apps/api/src ./src
COPY apps/api/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the app
CMD ["node", "dist/index.js"]
