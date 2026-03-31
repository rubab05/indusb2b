# HOMATZ B2B Platform — Baseline Audit

**Audit Date:** 2026-03-31
**Auditor:** baseline-auditor agent
**Branch:** b2b-rf

---

## 1. Build Status

| Check | Result |
|---|---|
| `npm install` | OK — 2 vulnerabilities (1 moderate, 1 high) — run `npm audit fix` when ready |
| `npm run build` | **PASS** — 0 errors, 0 warnings |
| Build output | `dist/index.html` 0.44 kB, `assets/index.js` 357.45 kB (gzip 107 kB), `assets/index.css` 109.34 kB (gzip 19.4 kB) |

---

## 2. Folder Structure

```
src/
├── main.tsx                          # App entry point
├── app/
│   ├── App.tsx                       # RouterProvider wrapper
│   ├── routes.tsx                    # Route definitions
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Hero.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SubcategoryCard.tsx
│   │   ├── FeaturedProductCard.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── SpecTable.tsx
│   │   ├── EnquiryForm.tsx
│   │   ├── VariantCard.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                       # shadcn/radix UI primitives (30+ files)
│   │       └── (accordion, alert, avatar, badge, button, card, carousel, ...)
│   └── pages/
│       ├── HomePage.tsx              # Approved baseline — LOCKED
│       ├── KitchenCategoryPage.tsx   # Approved baseline — LOCKED
│       └── ProductPage.tsx           # Approved baseline — LOCKED
├── content/
│   ├── site-content.ts
│   ├── categories.ts
│   ├── product-families.ts
│   └── navigation.ts
├── lib/
│   ├── content-types.ts
│   └── content-helpers.ts
├── styles/
│   ├── index.css                     # Entry: imports fonts, tailwind, theme
│   ├── tailwind.css                  # Tailwind v4 import + tw-animate-css
│   ├── theme.css                     # CSS custom properties (design tokens)
│   └── fonts.css                     # Imports slick-carousel CSS
└── imports/
    ├── homatz-homepage-design.md
    ├── b2b-platform-update.md
    └── pasted_text/
        ├── kitchen-household-category.tsx   # Reference import (not a live page)
        └── stock-pot-4-5l.tsx               # Reference import (not a live page)

docs/
├── homatz-master-content.docx        # Raw source reference
```

---

## 3. Route Map

```
/                                    → src/app/pages/HomePage.tsx
/categories/kitchen-household        → src/app/pages/KitchenCategoryPage.tsx
/products/stock-pot-4-5l-24cm        → src/app/pages/ProductPage.tsx
```

**ISSUE — Missing routes:** Only 3 routes are defined. The navigation.ts lists 5 categories and the content files contain data for all 5 categories and 16+ product families, but none of those pages have routes. The following routes have data but no route definitions:

- `/categories/mats-rugs`
- `/categories/decoration-seasonal`
- `/categories/garden-outdoor`
- `/categories/toys-games`
- All product pages except `/products/stock-pot-4-5l-24cm`

**ISSUE — Navigation links broken:** Header.tsx does not consume `navigation.ts`. It hardcodes anchor href links (`/#categories`, `/#about`, `#`, `#`) instead of using the navigation data file. CATEGORIES and TRADE and CONTACT links are non-functional (`href="#"`).

**ISSUE — No 404 route:** There is no catch-all / 404 route defined in routes.tsx.

---

## 4. Content Wiring Status

### 4.1 `src/content/categories.ts`

| Status | Detail |
|---|---|
| Completeness | COMPLETE — All 5 categories present: mats-rugs, decoration-seasonal, kitchen-household, garden-outdoor, toys-games |
| Data shape | Matches `CategoryContent` interface exactly |
| Issues | None in the data file itself |

### 4.2 `src/content/product-families.ts`

| Status | Detail |
|---|---|
| Completeness | COMPLETE — All 16+ product families present across all 5 categories |
| Data shape | Matches `ProductFamilyContent` interface |
| Issues | None in the data file itself |

### 4.3 `src/content/site-content.ts`

| Status | Detail |
|---|---|
| Completeness | COMPLETE — brandName, tagline, about, tradeMessage, processSteps (5), benefits (6), contact |
| Data shape | Matches `SiteContent` interface |
| Issues | None |

### 4.4 `src/lib/content-types.ts`

| Status | Detail |
|---|---|
| Completeness | COMPLETE — All interfaces defined: CTA, ImageItem, BreadcrumbItem, BenefitCard, LinkCard, SpecRow, PageSection (union type), CategoryContent, ProductFamilyContent, SiteContent |
| Issues | None |

### 4.5 `src/lib/content-helpers.ts`

| Status | Detail |
|---|---|
| Functions | `getCategoryBySlug`, `getProductFamilyBySlug`, `getProductsByCategorySlug`, `getRelatedCategories` |
| Issues | `getRelatedCategories` returns ALL categories except the current slug — this is a rough filter that ignores the per-category `relatedCategories` data already defined on each category |

### 4.6 `src/content/navigation.ts`

| Status | Detail |
|---|---|
| Completeness | COMPLETE — All 5 categories listed, main nav items defined |
| Issues | Header.tsx does NOT consume this file — nav links are hardcoded in JSX |

---

## 5. Page-Level Content Wiring — Approved Pages

### HomePage.tsx

**ISSUE — Heavily hardcoded.** The page does NOT consume `site-content.ts`, `categories.ts`, or any content TS files. All data is hardcoded directly in JSX:

- All images are hardcoded Unsplash URLs (inline variables)
- Category names, product counts, and b2bLabel values are hardcoded as JSX props
- "How Our B2B Platform Works" steps are fully hardcoded (5 `<div>` blocks, text copied from `site-content.ts` but not imported from it)
- "B2B Platform Benefits" cards are fully hardcoded (text matches `site-content.ts` but is not consumed from it)
- "About HOMATZ" section text is hardcoded (matches `site-content.ts` `about` field but not imported)
- All button labels hardcoded

This page violates the golden rule: "Content lives in TS files — never hardcode category/product data in JSX."

### KitchenCategoryPage.tsx

**ISSUE — Hardcoded.** The page does NOT consume `categories.ts`. All data is hardcoded:

- All images are hardcoded Unsplash URLs
- Category hero title, description, intro text hardcoded
- All subcategory names and descriptions hardcoded (not from `categories.ts`)
- Featured product families hardcoded (not from `categories.ts` `featuredFamilies`)
- Benefits section fully hardcoded (text matches `categories.ts` but not consumed from it)
- Best sellers carousel hardcoded
- Related categories hardcoded
- Trade CTA strip text hardcoded

This page violates the golden rule.

### ProductPage.tsx (Stock Pot)

**ISSUE — Hardcoded.** The page does NOT consume `product-families.ts`. All data is hardcoded:

- Product images are hardcoded Unsplash URLs
- Product title, description, key features list all hardcoded
- Size/capacity/finish selector values hardcoded
- Spec table data (`specs` array) defined as inline constant
- Use cases hardcoded as an inline array
- Related products hardcoded
- Support block text hardcoded

This page violates the golden rule.

**Summary:** Zero of the three approved pages consume content from the TS content files. The content files are complete and correct — but the page components need to be refactored to consume them before templating can begin.

---

## 6. Component Inventory

### Approved Shared Components (confirmed present)

| Component | File | Notes |
|---|---|---|
| Header | `src/app/components/Header.tsx` | Present. Does NOT consume navigation.ts. Nav hardcoded. |
| Footer | `src/app/components/Footer.tsx` | Present |
| Breadcrumbs | `src/app/components/Breadcrumbs.tsx` | Present |
| CategoryCard | `src/app/components/CategoryCard.tsx` | Present |
| ProductCard | `src/app/components/ProductCard.tsx` | Present |
| ProductCarousel | `src/app/components/ProductCarousel.tsx` | Present |
| SubcategoryCard | `src/app/components/SubcategoryCard.tsx` | Present |
| FeaturedProductCard | `src/app/components/FeaturedProductCard.tsx` | Present |
| ImageWithFallback | `src/app/components/figma/ImageWithFallback.tsx` | Present |
| ProductImageGallery | `src/app/components/ProductImageGallery.tsx` | Present |
| SpecTable | `src/app/components/SpecTable.tsx` | Present |
| EnquiryForm | `src/app/components/EnquiryForm.tsx` | Present |
| VariantCard | `src/app/components/VariantCard.tsx` | Present |
| Hero | `src/app/components/Hero.tsx` | Present (homepage hero) |

### UI Primitives (shadcn/radix)

30+ components in `src/app/components/ui/` — accordion, alert, badge, button, card, carousel, checkbox, dialog, dropdown-menu, form, input, label, pagination, popover, select, separator, sheet, sidebar, table, tabs, textarea, toast, tooltip, etc.

---

## 7. Issues Summary

### Critical (blocks Phase 2 progress)

| # | Issue | Location |
|---|---|---|
| C1 | HomePage.tsx does not consume site-content.ts or categories.ts — fully hardcoded | `src/app/pages/HomePage.tsx` |
| C2 | KitchenCategoryPage.tsx does not consume categories.ts — fully hardcoded | `src/app/pages/KitchenCategoryPage.tsx` |
| C3 | ProductPage.tsx does not consume product-families.ts — fully hardcoded | `src/app/pages/ProductPage.tsx` |
| C4 | Only 3 routes exist; 4 category pages and ~15 product pages have data but no routes | `src/app/routes.tsx` |

### Major (affects usability and correctness)

| # | Issue | Location |
|---|---|---|
| M1 | Header.tsx does not consume navigation.ts — nav is hardcoded with broken links | `src/app/components/Header.tsx` |
| M2 | CATEGORIES, TRADE, CONTACT nav links point to `href="#"` (non-functional) | `src/app/components/Header.tsx` |
| M3 | No 404 / catch-all route defined | `src/app/routes.tsx` |
| M4 | All images across all pages are Unsplash placeholder URLs — no real product images exist at `/images/*` paths | All pages |

### Minor / Advisory

| # | Issue | Location |
|---|---|---|
| A1 | `getRelatedCategories` helper ignores per-category `relatedCategories` data | `src/lib/content-helpers.ts` |
| A2 | `npm audit` reports 2 vulnerabilities (1 moderate, 1 high) | `package.json` |
| A3 | `package.json` name is `@figma/my-make-file` — should be renamed to match the project | `package.json` |
| A4 | `src/imports/` folder contains reference pasted text files — not live pages, not cleaned up | `src/imports/` |

---

## 8. Phase 1 Exit Criteria Status

| Criteria | Status |
|---|---|
| Project runs with 0 errors | PASS (build succeeds) |
| All 3 approved pages render | LIKELY — build passes, no import errors |
| All content consumed from TS content files | FAIL — all three pages are hardcoded |
| Design tokens documented | COMPLETE (see design-tokens.md) |
| Baseline audit doc saved | COMPLETE (this file) |
