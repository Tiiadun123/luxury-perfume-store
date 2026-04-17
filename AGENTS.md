# AGENTS.md - Operational Intelligence

This repository is optimized for autonomous agent collaboration. Follow these protocols to maintain the Maison Scêntia standard.

## Tech Stack & Conventions
- **Framework**: Next.js 15+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + shadcn/ui
- **Infrastructure**: Stripe (Payments), Resend (Emails)

## Key Locations
- `/src/features/shop`: The heart of the e-commerce engine (actions, sidebar, cards).
- `/src/app/admin`: Secure administrative control panel.
- `/src/utils/supabase`: Database client and type definitions.

## Automatic Classification Standards
- **Brands**: Dynamically fetched via `getBrands()`. No static arrays allowed in the shop sidebar.
- **Gender**: Classified into 'Men', 'Women', or 'Unisex'. Mapped in DB via `product_categories`.
- **Images**: Must use high-quality, stable URLs. Avoid local placeholders for production-ready state.

## Best Practices
1. **Migrations**: Always check for existing slugs before bulk inserts to avoid `23505` errors.
2. **Types**: Avoid `any`. Use the interfaces defined in `src/features/*/actions.ts`.
3. **Hydration**: Always provide `sizes` and `priority` props to `next/image` to prevent layout shift and warnings.

## Recent Updates
- Integrated 30 global perfume brands and legendary products.
- Refined the `ShopSidebar` to handle dynamic data from the database.
- Hardened the `getProducts` action for case-insensitive filtering.
