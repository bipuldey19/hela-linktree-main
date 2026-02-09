#!/bin/bash
set -e

echo "=== Hela Site Setup ==="

# 1. Install dependencies
echo "Installing dependencies..."
npm ci

# 2. Check for .env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "Created .env file from template."
  echo "Please edit .env with your settings:"
  echo "  - Set SITE_URL to your domain"
  echo "  - Generate AUTH_SECRET with: openssl rand -base64 32"
  echo ""
  echo "Then run this script again."
  exit 1
fi

# 3. Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# 4. Push schema to database
echo "Pushing database schema..."
npx prisma db push

# 5. Seed database
echo "Seeding database..."
npx tsx prisma/seed.ts

# 6. Create upload directories
mkdir -p public/uploads/blog public/uploads/site

# 7. Build Next.js
echo "Building application..."
npm run build

echo ""
echo "=== Setup complete! ==="
echo ""
echo "To start in development: npm run dev"
echo "To start in production:  pm2 start deployment/ecosystem.config.js"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@example.com"
echo "  Password: changeme123"
echo "  IMPORTANT: Change the password after first login!"
