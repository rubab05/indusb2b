# HOMATZ — B2B Wholesale & Dropshipping Platform

Complete React + TypeScript B2B platform. NOT a retail site. NOT just a frontend.
Covers: public storefront, partner portal, business workflows, CMS/admin, internal ops.

## Rules

- Inspect before changing — read the file first, always.
- Reuse before creating — `grep -r "ComponentName" src/` before making anything.
- Never touch approved pages — Homepage, Kitchen & Household category, Stock Pot product page are locked baseline.
- Content lives in TS files — never hardcode category/product data in JSX.
- Slug-based routing — dynamic pages use `:slug` params, not one-off files.
- Whitelabel-ready — brand name, logo, colours come from context/config, never hardcoded.
- All new pages match the approved design language: white/neutral BGs, dark grey type, yellow accents, spacious sections, clean grids, trade CTAs.

## Key Paths

```
src/content/site-content.ts        — Homepage, messaging, benefits, about
src/content/categories.ts          — All category data
src/content/product-families.ts    — All product family data
src/content/navigation.ts          — Nav structure
src/lib/content-types.ts           — TS interfaces for content
src/lib/content-helpers.ts         — Slug lookup, filters, utilities
docs/homatz-master-content.docx    — Raw source reference (don't use directly in code)
```

## Approved Components (don't rebuild)

Shared: `Header`, `Footer`, `Breadcrumbs`, `CategoryCard`, `ProductCard`, `ProductCarousel`
Category: `SubcategoryCard`, `FeaturedProductCard`, `ImageWithFallback`
Product: `ProductImageGallery`, `SpecTable`, `EnquiryForm`, `VariantCard`

## Checks After Every Task

```bash
npm run build          # 0 errors
npx tsc --noEmit       # 0 type errors
```

## Don'ts

- No `any` types
- No hardcoded brand colours/names
- No components over 300 lines
- No console.log left behind
- No unused imports
- No placeholder/lorem content in committed work
