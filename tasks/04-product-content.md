# Task 4 — Populate All Product Family Content

Add structured content for all 15 remaining product families.

## Steps

1. Read `docs/homatz-master-content.docx` — extract product family data.
2. Read `src/content/product-families.ts` — study the Stock Pot entry as the shape reference.
3. Add complete entries for every product family below. Each must include: title, slug, category slug, summary, gallery images, features, use cases, specs, variants, related products, related categories, support block.

### Mats & Rugs
- `barrier-mats`, `shaggy-rugs`, `chindi-rag-rugs`, `hallway-runner-rugs`

### Decoration & Seasonal
- `wax-burners`, `christmas-candle-bridges`, `artificial-christmas-trees`, `pencil-slim-christmas-trees`

### Garden & Outdoor
- `bamboo-fence-screening`, `bamboo-canes`, `green-garden-sticks`, `wooden-garden-stakes`, `artificial-hedge-screening`, `gazing-balls`

### Toys & Games
- `hula-hoops`

4. Verify each product family renders correctly via the ProductPage template at `/category/:catSlug/:productSlug`.
5. Check that category pages' featured families and best sellers link to the correct product pages.
6. `npm run build` — 0 errors.
