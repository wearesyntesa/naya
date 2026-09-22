# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Naya is Syntesa's knowledge base system: a Next.js app with a [Keystatic](https://keystatic.com) CMS backend. Content (MDX docs) is authored through the Keystatic admin UI at `/keystatic` and persisted via GitHub storage to a separate content repo, [`wearesyntesa/naya-storage`](https://github.com/wearesyntesa/naya-storage) — not committed to this repo.

## Commands

```bash
pnpm dev      # start the dev server
pnpm build    # production build
pnpm start    # run the production build (next start)
pnpm lint     # ESLint (eslint-config-next, flat config)
```

There is no test suite configured in this repo.

### Environment setup

Copy `.env.example` to `.env` and fill in:
- `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` — from the GitHub App backing Keystatic's GitHub storage mode.
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` — that GitHub App's slug.
- `KEYSTATIC_SECRET` — generate with `openssl rand -hex 32`.
- `NEXT_PUBLIC_SITE_URL` — the site's own URL (`http://localhost:3000` in dev).

Without valid GitHub App credentials, the Keystatic admin UI (`/keystatic`) cannot read/write content.

## Architecture

- **`keystatic.config.ts`** (repo root) is the single source of truth for CMS content shape. It defines the `docs` collection (MDX files with a `title` slug field and `content` field), backed by GitHub storage pointed at `wearesyntesa/naya-storage`. Any new content type/collection is added here first.
- **Keystatic wiring is split across three files** that all import `keystatic.config.ts`:
  - `app/keystatic/keystatic.ts` — client component rendering the admin UI (`makePage`).
  - `app/keystatic/[[...params]]/page.tsx` + `app/keystatic/layout.tsx` — the catch-all route that mounts the admin UI at `/keystatic`.
  - `app/api/keystatic/[...params]/route.ts` — the API route handler (`makeRouteHandler`) Keystatic's UI talks to for reading/writing content via the GitHub App.
- **`src/content/docs/`** holds the local MDX content collection matching the `docs` schema in `keystatic.config.ts` (used for local/static builds; the canonical editable copy lives in `naya-storage` when GitHub storage is active).
- **UI components** follow shadcn conventions (`components.json`, style `base-nova`, base color `neutral`): primitives live in `components/ui/` (e.g. `button.tsx`), app-level composed components live directly in `components/` (e.g. `topbar.tsx`, `toggle-theme.tsx`, `theme-provider.tsx`). Path alias `@/*` maps to the repo root (see `tsconfig.json`); shadcn aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`) follow the same convention.
- **Theming** uses `next-themes` (`ThemeProvider` in `components/theme-provider.tsx`, wrapped around the app in `app/layout.tsx`) with `attribute="class"` and system-theme detection; Tailwind v4 dark-mode classes (`dark:`) are used throughout.
- **`lib/utils.ts`** exports `cn()` (clsx + tailwind-merge), the standard shadcn className helper.
- `next.config.ts` transpiles `next-mdx-remote` and marks `@keystatic/next`/`@keystatic/core` as server-external packages — required for Keystatic to work correctly in the Next.js server runtime.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): on push/PR to `main`, installs with pnpm, runs `pnpm lint`, then `pnpm build`.
- **CD** (`.github/workflows/cd.yml`): triggered via `workflow_run` after CI succeeds on a `push` to `main` (also runnable via `workflow_dispatch`), builds and deploys to Vercel via the Vercel CLI using `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` secrets. It checks out `workflow_run.head_sha` rather than `main` HEAD, so a later push can't be deployed in place of the commit CI actually validated.
- **`vercel.json`** sets `git.deploymentEnabled.main = false`. This is what makes the CI gate real: without it Vercel's GitHub integration deploys straight off the push webhook, in parallel with CI and regardless of its result. Production now deploys only through the CD workflow's CLI call; preview deploys on other branches and PRs are unaffected.
- `vercel build` in CD reads env vars from the Vercel project's Production environment (via `vercel pull`), **not** from the GitHub secrets `ci.yml` uses — the Keystatic/site variables must be set in both places.
