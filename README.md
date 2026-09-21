# Naya

Syntesa knowledge base system managed through [Keystatic](https://keystatic.com) with NextJS, stored as MDX in a separate GitHub repo ([`wearesyntesa/naya-storage`](https://github.com/wearesyntesa/naya-storage)).

## Getting Started

Install dependencies and copy the env file:

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

- `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` — from the GitHub App's settings page.
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` — the GitHub App's slug.
- `KEYSTATIC_SECRET` — a random secret you generate yourself (`openssl rand -hex 32`).
- `NEXT_PUBLIC_SITE_URL` — the site's own URL (`http://localhost:3000` in dev).

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and [http://localhost:3000/keystatic](http://localhost:3000/keystatic) for the content editor.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production server (`next start`)
- `pnpm lint` — run ESLint
