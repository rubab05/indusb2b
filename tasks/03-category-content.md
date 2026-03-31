# Task 3 — Populate All Category Content

Add structured content for the 4 remaining categories so they render via the CategoryPage template.

## Steps

1. Read `docs/homatz-master-content.docx` to extract category content.
2. Read `src/content/categories.ts` — study the Kitchen & Household entry as the data shape reference.
3. Add complete entries in `categories.ts` for each:
   - **Mats & Rugs** (slug: `mats-and-rugs`)
   - **Decoration & Seasonal Products** (slug: `decoration-and-seasonal`)
   - **Garden & Outdoor** (slug: `garden-outdoor`)
   - **Toys & Games** (slug: `toys-games`)
4. Each entry must include: hero (title, description, image), intro, subcategories, featured families, benefits, best sellers, CTA strips, related categories. Mirror the Kitchen & Household shape exactly.
5. Update `src/content/navigation.ts` to include all 5 categories.
6. Navigate to each new category route and confirm it renders correctly through CategoryPage.
7. Verify the Header navigation reflects the updated structure.
8. `npm run build` — 0 errors.
