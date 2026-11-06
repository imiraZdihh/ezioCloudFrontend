# EZIOCLOUD frontend

EZIOCLOUD is a TanStack Start login and landing page with Supabase email/password authentication. It is configured to deploy as a Cloudflare Worker with static assets.

## Local development

Install dependencies with either npm or pnpm:

```bash
npm install
npm run dev
```

or:

```bash
pnpm install
pnpm run dev
```

Create `.env.local` from `.env.example` and add the public Supabase project URL and anon key before testing authentication.

## Cloudflare deployment

This repository uses the TanStack Start Cloudflare module preset. The production build creates the worker at `.output/server/index.mjs` and static assets at `.output/public`.

### Cloudflare dashboard setup

Create a Cloudflare Worker from the GitHub repository and use:

- **Build command:** `npm run cloudflare:build`
- **Deploy command:** `npx wrangler deploy --config wrangler.jsonc`
- **Root directory:** `/`

Add these variables under the Cloudflare Worker’s build/deployment environment:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

These are public client-side Supabase values. Never add a Supabase service-role key to this repository or to browser-exposed variables.

### Deploy from a terminal

Authenticate Wrangler once:

```bash
npx wrangler login
```

Then build and deploy:

```bash
npm run cloudflare:deploy
```

To run the built Worker locally:

```bash
npm run cloudflare:preview
```

The checked-in [`wrangler.jsonc`](./wrangler.jsonc) points Wrangler at the generated TanStack Start worker and its assets. Do not commit `.env.local`, `.dev.vars`, or Cloudflare credentials.
