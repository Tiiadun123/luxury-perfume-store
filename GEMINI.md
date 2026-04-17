# GEMINI.md - Antigravity Kit

Welcome to the Maison Scêntia Antigravity Kit. This document serves as the core intelligence and operational guide for agents working on this luxury perfume platform.

## Agent Persona & Principles
- **Elevated Aesthetics**: Every UI change must feel premium, minimalist, and luxury-tier.
- **Data Integrity**: Ensure product classifications (Brands, Gender, Families) are always accurate and synchronized between the database and UI.
- **Performance First**: Use server actions and optimized images to keep the experience seamless.

## Core Workflows
### 1. Inventory Management
- When adding new products, ensure the `slug` is unique and the `brand_id` is correctly mapped.
- Every product must have at least one variant (size/price) and one main image.
- **Classification**: Assign products to Gender categories (Men, Women, Unisex) via the `product_categories` mapping table.

### 2. UI/UX Standards
- Use the `ScentiaImage` component for robust image handling.
- Maintain the "Dark Mode" luxury aesthetic with gold/primary accents.
- Ensure responsive design across all viewports.

## Recent Expansion Details
- **Brands Integrated**: 30+ globally renowned houses including Chanel, Dior, Hermès, Tom Ford, Creed, and various niche houses like MFK and Le Labo.
- **Dynamic Filtering**: The `ShopSidebar` now fetches brands and categories dynamically from the database to ensure new additions are automatically classified.

## Operational Rules
- **Database**: Use `apply_migration` for DDL and bulk DML operations.
- **Filesystem**: Keep feature logic in `src/features/`.
- **Styling**: Stick to the established Tailwind/CSS variables in `globals.css`.

---
*Stay elegant. Stay precise.*
