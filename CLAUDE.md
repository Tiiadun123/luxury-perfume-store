# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important project notes
- This repo ships with custom Next.js behavior. Read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js APIs or conventions (see AGENTS.md).

## Common commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`

## Architecture overview
- **Next.js App Router** lives in `src/app/` with route groups like `(shop)` and `(auth)` plus admin routes under `src/app/admin`.
- **Feature modules** live in `src/features/<domain>` (shop, cart, checkout, auth, admin, etc.), typically with `actions.ts` for server actions and `components/` for UI.
- **Shared UI/components** live in `src/components/` (layout, providers, UI primitives, effects).
- **State management** uses Zustand stores in `src/features/*/store.ts` (cart, wishlist) and React Context where needed (comparison context).
- **Backend integrations**:
  - Supabase clients live in `src/utils/supabase/*` with middleware in `src/middleware.ts` to refresh sessions and protect admin routes.
  - Stripe client in `src/lib/stripe.ts`; Resend email helpers in `src/lib/resend.ts` and `src/lib/emails/*`.
- **Styling**: global styles in `src/app/globals.css`, plus component-level Tailwind classes.
