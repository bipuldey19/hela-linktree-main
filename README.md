This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production / Deployment

### Run as production (local or server)

1. Copy env and set production values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`: set `AUTH_SECRET` (e.g. `openssl rand -base64 32`), `AUTH_URL` and `SITE_URL` to your public URL, and `NODE_ENV=production`.

2. Install, migrate DB, seed, build and start:
   ```bash
   npm ci
   npm run db:push
   npm run db:seed
   npm run build
   npm start
   ```
   Or in one go: `npm run prod:init` (after copying and editing `.env`).

3. App runs at `http://localhost:3000` (or your `PORT`). Default admin: `admin@example.com` / `changeme123` — change after first login.

### Docker

```bash
# Set env (e.g. AUTH_SECRET, AUTH_URL, SITE_URL) in .env or export them, then:
docker compose up -d --build
```

App is on port 3000. Database and uploads are stored in Docker volumes.

### PM2 (Linux server)

Deploy the repo to e.g. `/var/www/hela-site`, set `.env`, then:

```bash
npm ci && npm run db:push && npm run db:seed && npm run build
pm2 start deployment/ecosystem.config.js
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
