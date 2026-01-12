FROM node:20-bookworm

# Install Playwright system dependencies
RUN npx playwright install-deps chromium

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Install Playwright browsers (matching the installed version)
RUN npx playwright install chromium

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]
