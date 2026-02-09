# Stage 1: Dependencies (better-sqlite3 and sharp need build tools on Alpine)
FROM node:20-alpine AS deps
WORKDIR /app

# Build tools for native modules (better-sqlite3 needs node-gyp)
RUN apk add --no-cache python3 make g++

# Install deps only; skip postinstall (prisma generate) until builder stage where schema exists
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --ignore-scripts

# Stage 2: Build (prisma generate + next build, same as prod:init; db:push/db:seed run at container start)
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="file:./prisma/dev.db"

RUN npx prisma generate && npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install only production dependencies needed at runtime
RUN apk add --no-cache libc6-compat su-exec curl

# Install PM2 for process management
RUN npm install -g pm2

# Copy PM2 config for Docker
COPY deployment/ecosystem.docker.js ./ecosystem.config.js

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets from standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files needed for db push/seed at runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/node_modules/@prisma/adapter-better-sqlite3 ./node_modules/@prisma/adapter-better-sqlite3
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx

# Copy entrypoint script (after COPY ecosystem so it can reference it)
COPY scripts/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && chown nextjs:nodejs ecosystem.config.js

# Create directories for uploads and database with proper permissions
RUN mkdir -p public/uploads/blog public/uploads/site && \
    chown -R nextjs:nodejs /app

# Run as root so entrypoint can fix volume permissions on start, then PM2 runs as nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
