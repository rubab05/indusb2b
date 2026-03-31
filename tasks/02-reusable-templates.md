# Task 2 — Extract Reusable Page Templates

Convert the approved Kitchen & Household and Stock Pot pages into reusable templates.

## Steps

### CategoryPage template
1. Read the existing Kitchen & Household page component end-to-end.
2. Refactor it into a generic `CategoryPage.tsx` template that receives all data via props/content lookup.
3. The template must support these sections (each optional, rendered only if data exists):
   - Category hero, intro text, trade utility strip, subcategory grid
   - Featured product families, category benefits, best sellers
   - Trade CTA strip, related categories
4. Wire it to load data from `categories.ts` using the `:slug` route param via `content-helpers.ts`.
5. Add/update route: `/category/:slug` → `CategoryPage`.
6. Verify Kitchen & Household still renders identically through the template. Fix any diff.

### ProductPage template
7. Read the existing Stock Pot page component end-to-end.
8. Refactor into a generic `ProductPage.tsx` template.
9. Sections (each optional):
   - Breadcrumbs, image gallery, summary/selectors/CTA panel
   - Trade CTAs, pricing visibility note, MOQ/bulk note
   - Long-form content (features, use cases), spec table, variant cards
   - Commonly bought with, enquiry form, support block, related categories
10. Wire to load from `product-families.ts` using `:categorySlug/:productSlug`.
11. Add/update route: `/category/:categorySlug/:productSlug` → `ProductPage`.
12. Verify Stock Pot still renders identically. Fix any diff.

### Final check
13. `npm run build` — 0 errors.
14. Both original approved pages must look exactly the same as before.
