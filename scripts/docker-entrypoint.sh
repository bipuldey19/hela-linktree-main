#!/bin/sh
set -e

# Ensure volume mounts are writable by nextjs (when running as root)
chown -R nextjs:nodejs /app/prisma /app/public/uploads 2>/dev/null || true

# Run database migrations and seed if DB doesn't exist
if [ ! -f /app/prisma/dev.db ]; then
  echo "Database not found. Initializing..."
  su-exec nextjs npx prisma db push
  su-exec nextjs npx tsx prisma/seed.ts
  echo "Database initialized with default admin."
fi

# Start the application with PM2 (foreground mode for Docker), running as nextjs
exec su-exec nextjs pm2-runtime start /app/ecosystem.config.js
