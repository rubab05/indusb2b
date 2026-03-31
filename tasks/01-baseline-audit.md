# Task 1 — Baseline Audit

Run the project and audit the existing codebase before any new work.

## Steps

1. Run `npm install && npm run dev` — confirm it starts with 0 errors.
2. List the full `src/` folder structure and document it.
3. Identify every existing route and its page component.
4. Visit the 3 approved pages (Homepage, Kitchen & Household category, Stock Pot product) — confirm they render fully with all sections, Header, Footer, Breadcrumbs.
5. Open these content files and verify their data is complete and matches what the pages render:
   - `src/content/categories.ts`
   - `src/content/product-families.ts`
   - `src/content/site-content.ts`
   - `src/lib/content-types.ts`
   - `src/lib/content-helpers.ts`
6. Check whether the approved pages consume content from the TS files or have hardcoded JSX. Flag any hardcoded content.
7. Extract the design tokens from the approved pages (colours, fonts, spacing, card styles, CTA styles, grid) and save them in a file at `docs/design-tokens.md`.
8. Run `npm run build` — confirm 0 errors.

## Output

Create `docs/baseline-audit.md` containing:
- Folder structure
- Route map
- Content wiring status (per-file)
- Any issues found
- Design tokens summary
