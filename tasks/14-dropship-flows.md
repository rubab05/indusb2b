# Task 14 — Dropship Balance & Ledger

Build the dropship-specific balance, ledger, top-up, and threshold lock flows.

## Steps

### Types & Services
1. Add to `src/types/commerce.ts`: DropshipBalance, Transaction (type: TopUp/Order/Refund/Adjustment), TopUpRequest, BalanceThreshold.
2. Create `src/services/dropship.service.ts`: mock balance, transactions, top-up handling.

### Pages
3. `/dashboard/dropship` — Dropship dashboard (dropship partners only):
   - Current balance (large, prominent)
   - Low balance warning banner (if below threshold)
   - Recent transactions list (last 10)
   - Quick top-up button
   - Balance trend mini-chart (last 30 days)
4. `/dashboard/dropship/ledger` — Full transaction ledger:
   - Table: Date, Type, Reference, Amount (+/-), Running Balance
   - Date range filter
   - Download statement button
5. `/dashboard/dropship/topup` — Top-up funds:
   - Current balance shown
   - Amount input: preset buttons (£100, £250, £500, £1000) + custom
   - Payment method: Bank Transfer / Card (UI only)
   - If Bank Transfer: show bank details + reference instructions
   - Submit → redirect to bank confirmation page
6. `/dashboard/dropship/topup/bank-confirm` — Bank transfer confirmation:
   - Reference number, amount
   - Upload proof of payment (UI placeholder)
   - Submit → confirmation message
7. `/dashboard/dropship/statement` — Downloadable statement:
   - Date range picker
   - Generate button (API-ready PDF)

### Low Balance Lock
8. When mock balance is below threshold:
   - Show persistent warning banner across all portal pages
   - Block order submission with clear message + link to top-up
   - Top-up page remains accessible

### Verify
9. Only dropship accounts see these pages. Wholesale accounts don't see them.
10. Test the threshold lock state by setting mock balance below threshold.
11. `npm run build` — 0 errors.
