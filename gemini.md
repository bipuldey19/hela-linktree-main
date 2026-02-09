# Hela Linktree - Project Overview

## Project Description
**Hela Linktree** is a "Link in Bio" application clone. It allows users to create personalized pages with links, likely supporting rich text descriptions and profile management.

## Tech Stack

### Core Framework
- **Next.js:** v16.1.6 (Latest App Router architecture implied)
- **React:** v19.2.3
- **Language:** TypeScript

### Database & ORM
- **Database:** SQLite (via `better-sqlite3`)
- **ORM:** Prisma (`@prisma/client` v7.3.0)
- **Adapter:** `@prisma/adapter-better-sqlite3` for serverless/edge compatibility with SQLite.

### Authentication
- **Library:** NextAuth.js v5 (Beta 30)
- **Encryption:** `bcryptjs` for password hashing.

### Styling & UI
- **CSS Framework:** Tailwind CSS v4
- **Typography:** `@tailwindcss/typography` plugin.
- **Rich Text Editor:** Tiptap (Headless wrapper around ProseMirror)
  - Extensions: Image, Link, Placeholder, Starter Kit.

### Utilities & Validation
- **Validation:** `zod`
- **Image Processing:** `sharp`
- **Date Handling:** `date-fns`
- **Slug Generation:** `slugify`
- **Sanitization:** `isomorphic-dompurify`

## Development Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint checks. |
| `npm run db:push` | Pushes the Prisma schema state to the SQLite database (prototyping). |
| `npm run db:seed` | Seeds the database using `prisma/seed.ts`. |
| `npm run db:studio` | Opens Prisma Studio to view/edit data in the browser. |
| `npm run db:reset` | Force resets the database and re-seeds it. |
| `npm run setup` | Full setup: installs deps, pushes DB schema, seeds DB, and builds. |
| `npm run prod:init` | From zero to running production: installs, DB setup, build, and start. |

## Key Configuration Files (Inferred)
- **`package.json`**: Dependency management and scripts.
- **`prisma/schema.prisma`**: Database schema definition (implied by Prisma usage).
- **`prisma/seed.ts`**: Database seeding logic.
- **`.env`**: Environment variables (managed by `dotenv`).
- **`next.config.js` / `next.config.ts`**: Next.js configuration.
- **`tailwind.config.ts`**: Tailwind CSS configuration (if not using v4 CSS-only config).

## Notes
- The project uses **Tailwind v4**, which often relies on CSS-native configuration rather than a JS config file.
- **NextAuth v5** introduces significant changes compared to v4, often requiring middleware for session management.