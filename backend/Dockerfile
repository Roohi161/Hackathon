# ============================
# Build Stage
# ============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --ignore-scripts

# Generate Prisma Client
RUN npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

# ============================
# Production Stage
# ============================
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts && \
    npx prisma generate && \
    npm cache clean --force

# Copy built files
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/v1/health || exit 1

EXPOSE 5000

CMD ["node", "dist/main.js"]
