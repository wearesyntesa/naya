# Naya

Syntesa knowledge base system managed through Keystatic with NextJS, stored as MDX.

Content is authored through the Keystatic admin UI at `/keystatic` and persisted via GitHub storage to a separate content repo, [`wearesyntesa/naya-storage`](https://github.com/wearesyntesa/naya-storage) — not committed to this repo.

## File Structure

- `keystatic.config.ts` — single source of truth for CMS content shape (collections, fields, GitHub storage config).
- `app/keystatic/` — mounts the Keystatic admin UI at `/keystatic` (`keystatic.ts`, `[[...params]]/page.tsx`, `layout.tsx`).
- `app/api/keystatic/` — API route handler Keystatic's UI talks to for reading/writing content via the GitHub App.
- `components/ui/` — shadcn primitives (e.g. `button.tsx`).
- `components/` — app-level composed components (e.g. `topbar.tsx`, `toggle-theme.tsx`, `theme-provider.tsx`).
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).

## Development

Requires Node 22.x and pnpm.

1. Copy `.env.example` to `.env` and fill in the required values:
   - `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` — from the GitHub App backing Keystatic's GitHub storage mode.
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` — that GitHub App's slug.
   - `KEYSTATIC_SECRET` — generate with `openssl rand -hex 32`.
   - `NEXT_PUBLIC_SITE_URL` — the site's own URL (`http://localhost:3000` in dev).

   Without valid GitHub App credentials, the Keystatic admin UI (`/keystatic`) cannot read/write content.

2. Install dependencies and start the dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Lint:

   ```bash
   pnpm lint
   ```

## Building

```bash
pnpm build   # production build
pnpm start   # run the production build (next start)
```

CI (`.github/workflows/ci.yml`) runs `pnpm lint` then `pnpm build` on every push/PR to `main`. CD (`.github/workflows/cd.yml`) triggers after CI succeeds on `main` and deploys to Vercel.
