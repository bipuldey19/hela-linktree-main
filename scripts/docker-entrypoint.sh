#!/bin/sh
set -e

# Run database migrations/push if DB doesn't exist
if [ ! -f ./prisma/dev.db ]; then
  echo "Database not found. Initializing..."
  npx prisma db push
  npx tsx prisma/seed.ts
  echo "Database initialized with default admin."
fi

# Start the application
exec node server.js
