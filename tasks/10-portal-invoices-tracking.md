# Task 10 — Portal: Invoices & Tracking

Build invoices list and shipment tracking pages.

## Steps

### Invoices
1. Create `src/services/invoices.service.ts`: typed interfaces, mock data.
2. `/dashboard/invoices` — Invoices list:
   - Table: Invoice #, Order #, Date, Amount, Status (Paid/Pending/Overdue), Download action
   - Filter by status, date range
   - Pagination
   - Download triggers a mock action (API-ready)

### Tracking
3. Create `src/services/tracking.service.ts`: typed interfaces, mock data.
4. `/dashboard/tracking` — Shipment tracking:
   - Active shipments list: Order #, Carrier, Tracking #, Status, ETA
   - Click → tracking detail with visual timeline (Dispatched → In Transit → Out for Delivery → Delivered)
   - External carrier link (placeholder URL)
   - Empty state if no active shipments

### Verify
5. All links from order detail (Download Invoice, tracking info) connect to these pages.
6. `npm run build` — 0 errors.
