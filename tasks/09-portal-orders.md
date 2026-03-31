# Task 9 — Portal: Orders

Build the orders list and order detail pages inside the partner portal.

## Steps

1. Create `src/types/orders.ts`: Order, OrderItem, OrderStatus (Pending, Processing, Shipped, Delivered, Cancelled).
2. Create `src/services/orders.service.ts`: typed interfaces, mock order data (8-10 realistic orders).
3. `/dashboard/orders` — Orders list page:
   - Filter bar: status dropdown, date range, order number search
   - Table: Order #, Date, Items count, Total, Status badge, View button
   - Pagination
   - Empty state if no orders
4. `/dashboard/orders/:orderId` — Order detail:
   - Order header: number, date, status badge
   - Items table: product name, SKU, qty, unit price, line total
   - Order summary: subtotal, shipping, total
   - Shipping address
   - Tracking info section (if shipped)
   - Order timeline (status history with dates)
   - Actions: Download Invoice, Re-order, Cancel (if eligible)
5. Verify navigation from dashboard recent orders → order detail → back to list.
6. `npm run build` — 0 errors.
