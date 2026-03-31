# Task 13 — Wholesale Pricing & Ordering

Build wholesale-specific pricing visibility, bulk ordering, and quote request flows.

## Steps

### Types & Services
1. Create `src/types/commerce.ts`: PriceListItem, MOQRule, BulkDiscount, QuoteRequest.
2. Create `src/services/pricing.service.ts`: mock price list data, MOQ rules.
3. Create `src/services/ordering.service.ts`: mock order submission.

### Pricing Pages
4. `/dashboard/price-list` — Wholesale price list (visible only to approved wholesale partners):
   - Category filter tabs
   - Search by product name or SKU
   - Table: Product, SKU, MOQ, Unit Price, Bulk Price tiers, Stock Status
   - Download full list as CSV button (API-ready)
5. `/dashboard/moq-info` — MOQ & ordering rules:
   - Explanation of minimum order quantities
   - Per-category MOQ rules table
   - Bulk discount tier breakdown
   - Lead times and payment terms

### Ordering
6. `/dashboard/orders/new` — Bulk order page:
   - Product search / category browse
   - Add to order with quantity input (validate against MOQ)
   - Running order summary sidebar (items, quantities, subtotal)
   - Delivery address selection
   - Order notes field
   - Submit → confirmation with order number
7. `/dashboard/orders/quick` — Quick multi-SKU order:
   - Text area for pasting SKU + quantity pairs
   - CSV upload option (parse and validate)
   - Show matched products with pricing
   - Confirm and submit
8. `/dashboard/quote-request` — Request a quote:
   - Product selection with quantities
   - Special requirements textarea
   - Submit → confirmation with reference number

### Verify
9. Only wholesale account type sees these pages. Dropship accounts get redirected or see nothing in sidebar.
10. `npm run build` — 0 errors.
