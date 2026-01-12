FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]
