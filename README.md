# Ebi Tsū

Custom React website and Supabase-backed business platform for **Ebi Tsū / 海老通 / The Shrimp Connoisseur**.

## Stack

- React 19 and TypeScript
- Vite and Tailwind CSS
- Wouter routing
- Supabase Auth, PostgreSQL, Row Level Security, and Edge Functions
- Resend transactional email
- Cloudflare deployment

## Local development

```bash
pnpm install
pnpm dev
```

The development server is available at `http://localhost:3000` by default.

## Validation

```bash
pnpm check
pnpm build
pnpm audit --prod
```

## Project structure

```text
client/
  public/assets/       Optimized brand imagery
  src/components/     Shared brand and layout components
  src/lib/            Supabase client and generated database types
  src/pages/          Public, account, catalog, request, and admin routes
server/                Production static-file server
supabase/
  functions/           Versioned Edge Function source
  migrations/          Versioned database changes
```

## Backend workflow

Database changes belong in `supabase/migrations/`. The deployed transactional email handler is versioned at `supabase/functions/send-inquiry-email/index.ts` and requires the `RESEND_API_KEY` Supabase secret. Supabase automatically provides its project URL, anonymous key, and service-role key to the function runtime.

The public Supabase publishable key in `client/src/lib/supabase.ts` is intentionally client-safe. Service-role and Resend credentials must never be placed in frontend code or committed files.

## Deployment

The production site is deployed through Cloudflare from GitHub. Use the existing Cloudflare project commands and settings; do not commit `dist/`, local environment files, Manus runtime files, or `.project-config.json`.
