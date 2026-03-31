# Task 15 — Admin Layout & Content CMS

Build the admin panel shell and content management screens.

## Steps

### Admin Layout
1. Create `src/layouts/AdminLayout.tsx`:
   - Sidebar: Content (Categories, Products, Pages, FAQ, Media), Partners, Commerce, Platform, Operations
   - Top bar: admin user info, link back to public site
   - Breadcrumbs in content area
2. Route group: `/admin/*` — protected by AuthGuard with `requireAdmin: true`.

### Category CMS
3. `/admin/categories` — Category list table with Add button.
4. `/admin/categories/:slug/edit` — Edit category form:
   - Name, slug, hero image, description, intro
   - Subcategories: add/remove/reorder
   - Featured families: select from existing products
   - Benefits, CTA strip text, SEO fields (meta title, description)
   - Save / Preview (opens public page)

### Product Family CMS
5. `/admin/products` — Product list with category filter + Add button.
6. `/admin/products/:slug/edit` — Edit product family:
   - Name, slug, category assignment
   - Summary, long description
   - Image gallery: add/remove/reorder
   - Features list, use cases
   - Spec table (dynamic key-value rows: add/remove)
   - Variants management
   - Related products selection
   - SEO fields
   - Save / Preview

### Pages CMS
7. `/admin/pages` — Static pages list.
8. `/admin/pages/:slug/edit` — Edit page: title, slug, body (rich textarea), meta fields, publish/draft toggle.

### FAQ CMS
9. `/admin/faq` — FAQ items list. Add/edit/delete/reorder. Category grouping.

### Media Library
10. `/admin/media` — Upload images, browse/search, copy URL, delete.

### Important
- All forms save to local state / mock service. Interfaces must be typed and API-ready.
- CMS forms should update the same data shapes defined in `content-types.ts`.
11. `npm run build` — 0 errors.
