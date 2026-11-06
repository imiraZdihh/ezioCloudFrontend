# EZIOCLOUD authentication plan

## Implementation

Reuse the existing EZIOCLOUD portal card from `src/components/ezio/AuthCard.tsx` and connect it to Supabase Auth, which provides a free-tier hosted authentication API for email/password accounts. The website and a future Tauri or Electron Windows client can use the same Supabase project and credentials without exposing a database connection.

Authentication is configured through `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The UI handles sign-up with display-name metadata, email/password login, persisted sessions, sign-out, and password-reset email links. If the environment is not configured, the page remains usable as a visual preview and explains how to connect it rather than pretending a user was authenticated.

## Project structure

- `src/lib/supabase.ts`: Supabase client and configuration detection.
- `src/components/ezio/AuthCard.tsx`: Existing branded login/register UI backed by Supabase Auth.
- `.env.example`: Required free Supabase environment variables.
- `public/manus-routes.json`: Route manifest for the single-page website.

## Design

The existing design is retained: a cinematic dark-purple editorial landing page with glassmorphism, neon lilac/pink accents, Space Grotesk display type, DM Mono utility labels, and motion-led transitions. Authentication feedback uses the same toast and portal language so the real states feel native to the supplied reference.
