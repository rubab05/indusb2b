# Task 8 — Portal Layout & Dashboard

Build the partner portal shell and dashboard. Everything under `/dashboard` uses this layout.

## Steps

### Portal Layout
1. Create `src/layouts/PortalLayout.tsx`:
   - Left sidebar navigation (collapsible on mobile)
   - Top bar: user name, company name, account type badge (Wholesale/Dropship), logout
   - Main content area with breadcrumbs
   - Sidebar items: Dashboard, Orders, Invoices, Tracking, Support, Account Settings
   - Conditional item: "Balance & Ledger" visible only for Dropship accounts
2. All `/dashboard/*` routes render inside PortalLayout.
3. Responsive: sidebar collapses to hamburger or bottom nav on mobile.

### Dashboard
4. Create `/dashboard` — Partner dashboard page:
   - Welcome card with company name
   - Account status card (type, tier, approval date)
   - Quick stats row: recent orders count, pending orders, open support tickets
   - Recent orders table (last 5, clickable)
   - Quick action buttons: New Order, Price List, Contact Support
5. Create `src/services/dashboard.service.ts` — typed interfaces + mock data.

### Verify
6. Login as a mock approved user → lands on dashboard → all sidebar links present → layout responsive.
7. `npm run build` — 0 errors.
