# Task 16 — Admin: Partners, Pricing, Vendors, Whitelabel

Build the remaining admin management screens.

## Steps

### Partner Management
1. `/admin/partners/applications` — Pending applications table: Company, Type, Date, Status. Click → detail view. Approve / Reject with notes. Mock email trigger.
2. `/admin/partners/list` — Approved partners table: Company, Type, Joined, Status, Last Order. Click → detail. Suspend / reactivate. View order history.
3. `/admin/partners/roles` — Role & permission config: define access rules per partner type/tier.

### Pricing Admin
4. `/admin/pricing` — Pricing visibility rules:
   - Toggle category/product visibility per partner type
   - MOQ rules per category/product (add/edit/remove)
   - Bulk discount tier config
   - Save all

### Vendor Management
5. `/admin/vendors` — Vendor list + CRUD: name, contact, mapped product families, notes.

### Whitelabel / Brand Settings
6. `/admin/brand` — Brand configuration:
   - Brand name, logo upload (primary + secondary), favicon
   - Primary / secondary / accent colour pickers
   - Email branding (header/footer)
   - Document branding (invoice header)
   - Domain display (read-only, backend-configured)
7. Create `src/contexts/BrandContext.tsx`:
   - Provide brand config (name, logo, colours) to the entire app
   - Export `useBrand()` hook
8. Wrap app with `BrandProvider`.
9. Update Header, Footer, and any hardcoded brand references to consume `useBrand()`.

### Verify
10. All admin pages accessible only to admin role.
11. `npm run build` — 0 errors.
