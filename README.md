# Naya

Syntesa knowledge base system managed through Keystatic with NextJS, stored as MDX.

Content is authored through the Keystatic admin UI at `/keystatic` and persisted via GitHub storage to a separate content repo, [`wearesyntesa/naya-storage`](https://github.com/wearesyntesa/naya-storage) — not committed to this repo.

## File Structure

```
├── .github
│   └── workflows
│       ├── cd.yml
│       └── ci.yml
├── app
│   ├── api
│   │   └── keystatic
│   │       └── [...params]
│   ├── keystatic
│   │   ├── [[...params]]
│   │   ├── keystatic.ts
│   │   └── layout.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── CLAUDE.md
├── components
│   ├── ui
│   ├── theme-provider.tsx
│   ├── toggle-theme.tsx
│   └── topbar.tsx
├── components.json
├── eslint.config.mjs
├── keystatic.config.ts
├── lib
│   └── utils.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── public
├── README.md
├── tsconfig.json
└── vercel.json
```

- `keystatic.config.ts`: single source of truth for CMS content shape (collections, fields, GitHub storage config).
- `app/keystatic/`: mounts the Keystatic admin UI at `/keystatic` (`keystatic.ts`, `[[...params]]/page.tsx`, `layout.tsx`).
- `app/api/keystatic/`: API route handler Keystatic's UI talks to for reading/writing content via the GitHub App.
- `components/ui/`: shadcn primitives (e.g. `button.tsx`).
- `components/`: app-level composed components (e.g. `topbar.tsx`, `toggle-theme.tsx`, `theme-provider.tsx`).
- `lib/utils.ts`: `cn()` helper (clsx + tailwind-merge).
- `vercel.json`: disables Vercel's automatic Git deployments for `main` so production ships only through CD.

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

## Deployment

CI (`.github/workflows/ci.yml`) runs `pnpm lint` then `pnpm build` on every push/PR to `main`.

CD (`.github/workflows/cd.yml`) runs only after CI succeeds on a push to `main`, then builds and deploys to Vercel with the Vercel CLI. It can also be run manually via `workflow_dispatch`. It checks out the commit CI validated rather than `main` HEAD, so a later push can't be deployed in its place.

`vercel.json` is what makes that gate real:

```json
{ "git": { "deploymentEnabled": { "main": false } } }
```

Without it, Vercel's GitHub integration deploys straight off the push webhook — in parallel with CI and regardless of whether it passes. Scoping the flag to `main` disables production auto-deploys only; preview deploys on other branches and PRs still happen automatically.

### Deployment setup

- Repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- The CD build reads env vars from the Vercel project's Production environment (via `vercel pull`), **not** from the GitHub secrets CI uses. The Keystatic and site variables listed above must be set in both places.
- `workflow_run` only fires for workflows present on the default branch, so `cd.yml` must be merged to `main` before the gate takes effect.
