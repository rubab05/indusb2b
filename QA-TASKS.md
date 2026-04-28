# HOMATZ — Sequential QA & Fix Task List

> Run these tasks in order. Each task tells you what to check, what the correct behaviour is, and how to fix it if it's wrong.
> Complete each task fully before moving to the next.
>
> **Test credentials (from seed data)**
> | Role | Email | Password |
> |------|-------|----------|
> | Admin | `admin@homatz.com` | `admin123` |
> | Wholesale Partner | `buyer@tradeco.com` | `test123` |
> | Dropship Partner | `seller@dropstore.co.uk` | `test123` |
>
> **Dev servers**
> - Frontend: `npm run dev` → http://localhost:5173
> - Backend: `cd server && npm run dev` → http://localhost:4000

---

## TASK 1 — Environment Verification

**Goal**: Confirm both servers start cleanly before any testing begins.

### Steps

1. In the project root, run:
   ```bash
   npm install
   npm run dev
   ```
   **Expected**: Vite starts on http://localhost:5173 with no errors.

2. In a second terminal, run:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   **Expected**: Express starts on http://localhost:4000, prints `HOMATZ API running on port 4000`.

3. Visit http://localhost:5173 in the browser.
   **Expected**: Homepage renders with header, hero section, and footer.

4. Test API health:
   ```bash
   curl http://localhost:4000/api/categories
   ```
   **Expected**: JSON response (not a connection error).

### Fix If Broken

- If frontend fails to start: run `npx tsc --noEmit` and fix all TypeScript errors listed.
- If backend fails to start: check `server/.env` exists and has `DATABASE_URL`, `JWT_SECRET`. Copy from `server/.env.example` if missing.
- If the database isn't running: ensure PostgreSQL is running on port 5433 (or update `DATABASE_URL` in `server/.env` to your actual port). Then run `cd server && npm run db:push && npm run db:seed`.

### Completion Check

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:4000
- [ ] Homepage renders without console errors

---

## TASK 2 — TypeScript Build Verification

**Goal**: Zero TypeScript errors across both frontend and backend before testing anything.

### Steps

1. Frontend type check:
   ```bash
   npx tsc --noEmit
   ```
   **Expected**: No output (zero errors).

2. Backend type check:
   ```bash
   cd server && npm run lint
   ```
   **Expected**: No output (zero errors).

3. Frontend production build:
   ```bash
   npm run build
   ```
   **Expected**: Build completes successfully.

### Fix If Broken

Work through each TypeScript error reported. Common causes:
- Missing type imports → add the import
- `any` types → replace with the correct interface from `src/types/`
- Missing properties on objects → check the interface in `src/lib/content-types.ts` or `src/types/`
- Unused imports → remove them

Do not move to Task 3 until both type checks pass and the build succeeds.

### Completion Check

- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `cd server && npm run lint` → 0 errors
- [ ] `npm run build` → 0 errors

---

## TASK 3 — Fix: Admin Login Redirects to Wrong Page

**Bug confirmed in QA-dev.md**: After logging in as Admin (`admin@homatz.com`), the user is taken to `/dashboard` (the partner portal) instead of `/admin` (the admin panel).

### Root Cause

In `src/app/pages/LoginPage.tsx` at line 22, the redirect after successful login always goes to `/dashboard` regardless of the user's role. It does not check if the user is an `ADMIN`.

### Fix

Read `src/app/pages/LoginPage.tsx` first, then apply this fix.

In the "Already logged in" redirect block (around line 17–23), add a check for admin role **before** the generic `/dashboard` redirect:

```tsx
// Replace this:
return <Navigate to="/dashboard" replace />;

// With this:
if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
return <Navigate to="/dashboard" replace />;
```

The final block should look like:
```tsx
if (!loading && isAuthenticated && user) {
  if (user.approvalStatus === ApprovalStatus.PENDING) return <Navigate to="/apply/pending" replace />;
  if (user.approvalStatus === ApprovalStatus.REJECTED || user.approvalStatus === ApprovalStatus.SUSPENDED) {
    return <Navigate to="/apply/restricted" replace />;
  }
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}
```

You also need to import the `UserRole` type or check the role as a string. Look at `src/types/auth.ts` to confirm whether `user.role` is typed as the enum `UserRole` or as a plain string `'ADMIN'`. Use whatever type is already in use.

### Verify the Fix

1. Log in as `admin@homatz.com` / `admin123`
2. **Expected**: You land on `/admin/categories` (the admin panel), not `/dashboard`
3. Log out
4. Log in as `buyer@tradeco.com` / `test123`
5. **Expected**: You land on `/dashboard` (the partner portal)

### Completion Check

- [ ] Admin login → lands on `/admin`
- [ ] Wholesale partner login → lands on `/dashboard`
- [ ] Dropship partner login → lands on `/dashboard`

---

## TASK 4 — Fix: Apply Pages (Wholesale & Dropship)

**Context**: `src/app/pages/ApplyWholesalePage.tsx` and `src/app/pages/ApplyDropshipPage.tsx` have been modified (shown in git status). Verify the changes are correct and that both forms work end-to-end.

### Steps

1. Read `src/app/pages/ApplyWholesalePage.tsx` fully.
2. Read `src/app/pages/ApplyDropshipPage.tsx` fully.

**Check each form for:**

#### A. Password fields
Both apply pages collect `password` and `confirmPassword`. Verify:
- The password field is rendered in the form JSX (not just in state)
- `confirmPassword` validation checks that both passwords match and shows an error if they don't
- If the password field is missing from the JSX but present in state, add it between the phone field and the next section

#### B. Terms & Conditions link
The QA-dev.md notes "terms and conditions to be added". Verify:
- The terms checkbox label links to `/terms` (the T&C page)
- Current text should be something like: `I agree to the <Link to="/terms">Terms and Conditions</Link>`
- If the link is missing, add it so the user can read the T&C before accepting

#### C. Form submission
- The `onSubmit` handler calls the real backend API (via `api.post(...)`)
- On success it redirects to `/apply/pending`
- On API error it shows the error message from the server

#### D. Validation completeness
For **Wholesale**: Required fields must include `companyName`, `address`, `city`, `postcode`, `contactName`, `contactEmail`, `contactPhone`, `businessType`, `password`, `confirmPassword`, `terms`.

For **Dropship**: Required fields must include `companyName`, `address`, `city`, `postcode`, `contactName`, `contactEmail`, `contactPhone`, `websiteUrl`, `password`, `confirmPassword`, `terms`.

Fix any gaps found in the JSX or validation logic.

### Verify the Fix

1. Go to http://localhost:5173/apply/wholesale
2. Click Submit without filling anything — **Expected**: Red error messages appear next to all required fields
3. Fill the form completely (use `test@example.com` as email, any UK postcode, `password123` for both password fields)
4. Click Submit — **Expected**: Redirected to `/apply/pending`
5. Repeat for http://localhost:5173/apply/dropship

### Completion Check

- [ ] Wholesale form: password & confirm password fields visible and validated
- [ ] Dropship form: password & confirm password fields visible and validated
- [ ] Both forms: terms checkbox links to `/terms`
- [ ] Both forms: submit with empty fields shows validation errors
- [ ] Both forms: valid submission redirects to `/apply/pending`

---

## TASK 5 — Public Pages Audit

**Goal**: Every public-facing page loads correctly without errors.

### Steps

Visit each URL below. For each, check: page renders, no blank sections, no console errors, header and footer present.

| URL | What to see |
|-----|-------------|
| `/` | Homepage with hero, featured categories, footer |
| `/category/kitchen-and-household` | Category hero, product grid, breadcrumbs |
| `/category/mats-and-rugs` | Category page renders |
| `/category/decoration-and-seasonal` | Category page renders |
| `/category/garden-and-outdoor` | Category page renders |
| `/category/toys-and-games` | Category page renders |
| `/category/kitchen-and-household/stock-pot-4-5l-24cm` | Product page with gallery, specs, variants |
| `/about` | About page with content |
| `/how-it-works` | Process explanation page |
| `/faq` | FAQ page with questions |
| `/shipping` | Shipping policy |
| `/returns` | Returns policy |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/contact` | Contact page with form |
| `/apply` | Two-option landing (Wholesale / Dropship) |
| `/login` | Login form |
| `/forgot-password` | Email input form |
| `/nonexistent-route` | 404 page (not a blank white page) |

### Fix If Broken

- **Blank page**: Open browser DevTools (F12) → Console tab → note the error → fix the import or missing component
- **Missing content**: Check the relevant content file in `src/content/` — if a field is missing, add it
- **Broken import**: Fix the import path in the page component
- **No 404 page**: If visiting an unknown route shows a blank page, add a catch-all route in `src/app/routes.tsx`:
  ```tsx
  { path: "*", element: <div className="min-h-screen flex items-center justify-center"><h1>404 — Page Not Found</h1><a href="/">Go Home</a></div> }
  ```
  (Or create a proper `NotFoundPage.tsx` component and import it)

### Completion Check

- [ ] All category pages render
- [ ] Stock Pot product page renders
- [ ] All static info pages render
- [ ] Unknown URL shows a 404 message (not a blank page)

---

## TASK 6 — Auth Flow Testing

**Goal**: Login, logout, redirect, and session persistence all behave correctly for all user types.

### Steps

#### 6A — Logged-Out Redirects

1. While logged out, navigate directly to http://localhost:5173/dashboard
   **Expected**: Redirected to `/login`

2. While logged out, navigate to http://localhost:5173/admin
   **Expected**: Redirected to `/login`

3. While logged out, navigate to http://localhost:5173/dashboard/dropship
   **Expected**: Redirected to `/login`

#### 6B — Wholesale Partner Login

1. Go to `/login`, enter `buyer@tradeco.com` / `test123`
2. **Expected**: Lands on `/dashboard` (partner portal, not admin)
3. Check the top bar shows "WHOLESALE" badge
4. Check the sidebar does NOT show "Dropship Dashboard", "Top Up", "Ledger", "Statement"
5. Check the sidebar DOES show "Price List", "MOQ & Rules", "New Order", "Quick Order", "Quote Request"
6. Manually navigate to `/dashboard/dropship` — **Expected**: Redirected away (access denied or back to dashboard)
7. Click Sign Out — **Expected**: Returned to login page
8. Verify `/dashboard` now redirects to `/login` (session cleared)

#### 6C — Dropship Partner Login

1. Go to `/login`, enter `seller@dropstore.co.uk` / `test123`
2. **Expected**: Lands on `/dashboard`
3. Check the top bar shows "DROPSHIP" badge
4. Check the sidebar DOES show "Dropship Dashboard", "Transaction Ledger", "Top Up Funds", "Statement"
5. Check the sidebar does NOT show "Price List", "MOQ & Rules", "New Order", "Quick Order", "Quote Request"
6. Manually navigate to `/dashboard/price-list` — **Expected**: Redirected away (access denied)
7. Click Sign Out — **Expected**: Returned to login page

#### 6D — Admin Login

1. Go to `/login`, enter `admin@homatz.com` / `admin123`
2. **Expected**: Lands on `/admin` (after Task 3 fix)
3. Verify the admin sidebar is visible (Content, Partners, Commerce, Operations sections)
4. Manually navigate to `/dashboard` — **Expected**: Redirected to `/admin` (admin should not see the partner portal)
5. Click Sign Out — **Expected**: Returned to login page

#### 6E — Invalid Login

1. Go to `/login`, enter `wrong@email.com` / `wrongpassword`
2. **Expected**: An error message appears ("Invalid credentials" or similar), you stay on `/login`
3. The page does not crash or go blank

#### 6F — Session Persistence

1. Log in as `buyer@tradeco.com` / `test123`
2. Refresh the browser (F5)
3. **Expected**: Still on `/dashboard`, still logged in (not kicked to login)

### Fix If Broken

- **Wrong redirect after admin login**: See Task 3 above.
- **Wholesale user can access dropship routes**: Check `src/app/components/guards/DropshipGuard.tsx` — it should redirect non-dropship users. If missing or broken, add: `if (user.accountType !== AccountType.DROPSHIP) return <Navigate to="/dashboard" replace />;`
- **Dropship user can access wholesale routes**: Check `src/app/components/guards/WholesaleGuard.tsx` — same pattern.
- **Partner can access /admin**: Check `AuthGuard` — `requireAdmin` check is present at line 30 of `src/app/components/guards/AuthGuard.tsx`. If broken, verify the user role comparison string matches what the API returns.
- **Session lost on refresh**: The `AuthContext` reads `homatz_auth_token` from localStorage on mount and calls `authService.getCurrentUser()`. If this fails, the token is cleared. Check the `/api/auth/me` endpoint is working: `curl -H "Authorization: Bearer <token>" http://localhost:4000/api/auth/me`

### Completion Check

- [ ] Logged-out user → `/login` when accessing any protected route
- [ ] Wholesale login → `/dashboard`, sees wholesale nav, blocked from dropship routes
- [ ] Dropship login → `/dashboard`, sees dropship nav, blocked from wholesale routes
- [ ] Admin login → `/admin`, cannot access `/dashboard`
- [ ] Invalid credentials → error message, no crash
- [ ] Session survives browser refresh

---

## TASK 7 — Partner Portal: All Partners

**Goal**: Pages that all partners (both wholesale and dropship) use work correctly.
Log in as `buyer@tradeco.com` / `test123` for this task.

### Steps

#### 7A — Dashboard (`/dashboard`)

1. Verify welcome message shows the company name "TradeCo Ltd"
2. Three stat cards are visible: Total Orders, Pending Orders, Open Tickets
3. Numbers in the stat cards are real numbers (not `NaN`, `undefined`, or blank)
4. A "Recent Orders" table is visible with at least one row
5. Quick action buttons are present and clickable

#### 7B — Orders List (`/dashboard/orders`)

1. A table of orders appears with columns: Order #, Date, Items, Total, Status
2. Status badges are coloured (not plain text)
3. A search input is present — type part of an order number and verify the list filters
4. A status filter dropdown works — select "Processing" and verify only those orders show
5. Pagination controls appear if there are more than 5 orders
6. Click "View" on any order — **Expected**: Goes to order detail page

#### 7C — Order Detail (`/dashboard/orders/:orderId`)

1. Order number, date, and status are displayed at the top
2. A list of items with quantities and prices is visible
3. A delivery address is shown
4. An order status timeline is visible at the bottom
5. A "Download Invoice" button is present
6. A "Re-Order" button is present

#### 7D — Invoices (`/dashboard/invoices`)

1. A table of invoices is shown with Invoice #, Order #, Date, Amount, Status
2. Status is colour-coded (green = Paid, red = Overdue, grey = Pending)
3. A "Download" button is present on each row

#### 7E — Tracking (`/dashboard/tracking`)

1. A list of active shipments is shown
2. Each row shows carrier, tracking number, status, ETA
3. Clicking a shipment shows a more detailed timeline

#### 7F — Support Tickets (`/dashboard/support`)

1. A list of support tickets is shown with Ticket #, Subject, Status, Date
2. A "New Support Request" button is present

#### 7G — Create Support Ticket (`/dashboard/support/new`)

1. The form has: Subject, Category (dropdown), Related Order # (optional), Description (textarea), Attachment area
2. Submit with empty Subject and Description — **Expected**: Validation errors shown
3. Fill all required fields and submit — **Expected**: Success message or redirect to ticket list/detail

#### 7H — Support Ticket Detail (`/dashboard/support/:ticketId`)

1. Navigate to an existing ticket (from the support list)
2. Original message is visible
3. Any admin replies are shown in the thread
4. A reply textarea and "Send Reply" button are at the bottom
5. Typing a reply and clicking Send adds it to the thread

#### 7I — Account Settings (`/dashboard/account`)

1. Page loads with sections: Business Profile, Contact Details, Login & Security
2. Current data (company name, address, etc.) is pre-filled
3. Clicking "Edit" on a section enables the form fields
4. Changing a value and clicking "Save" saves it (no error)
5. Clicking "Cancel" reverts the change

### Fix If Broken

- **Data shows as `undefined` or blank**: Check the service file being used (e.g., `src/services/orders.service.ts`) — if using mock data, verify the mock data has all required fields populated.
- **Table not filtering**: The filter logic is in the page component. Read the component and check the filter state is being applied to the displayed data array.
- **Support ticket reply not appearing**: Check that the `onSubmit` handler updates local state after the API call resolves.
- **Account settings not pre-filling**: Check that `useEffect` fetches the current user data and sets the form state.

### Completion Check

- [ ] Dashboard: stats load, recent orders visible
- [ ] Orders: list, filter, search, pagination all work
- [ ] Order detail: items, address, timeline visible
- [ ] Invoices: list with status colours
- [ ] Tracking: shipment list visible
- [ ] Support: create ticket validates, submits, thread visible
- [ ] Account: pre-filled, edit/save/cancel work

---

## TASK 8 — Partner Portal: Wholesale-Only Features

**Goal**: Wholesale-specific pages work correctly.
Log in as `buyer@tradeco.com` / `test123`.

### Steps

#### 8A — Price List (`/dashboard/price-list`)

1. Page loads with a product table
2. Columns visible: Product Name, SKU, MOQ, Unit Price, Bulk Price, Stock Status
3. A category filter dropdown works — select a category and the list filters
4. A search input filters by product name or SKU
5. A "Download Price List" button is present

#### 8B — MOQ & Rules (`/dashboard/moq-info`)

1. Page loads with content explaining minimum order quantities
2. MOQ rules are listed per category or product
3. Bulk discount tiers are shown
4. Lead times and payment terms are mentioned

#### 8C — Bulk Order (`/dashboard/orders/new`)

1. A product search or category browse is available
2. Selecting a product and entering a quantity adds it to an order summary
3. Entering a quantity below MOQ shows a warning
4. The running order total updates correctly
5. A delivery address selector is present
6. An "Order Notes" field is present
7. Submitting the order shows a confirmation with an order number

#### 8D — Quick Order (`/dashboard/orders/quick`)

1. A text area for entering SKU + quantity pairs is present
2. A "Check Items" or "Validate" button validates the SKUs
3. Invalid SKUs are highlighted with an error
4. Valid items show their product name, price, and stock status
5. A "Submit Order" button is present

#### 8E — Quote Request (`/dashboard/quote-request`)

1. A form to select products and quantities is present
2. A "Special Requirements" notes field is available
3. Submitting gives a confirmation with a reference number

### Fix If Broken

- **Wholesale guard not working** (dropship user can see these pages): Read `src/app/components/guards/WholesaleGuard.tsx` and verify `user.accountType !== AccountType.WHOLESALE` causes a redirect.
- **MOQ validation not triggering**: In `BulkOrderPage.tsx`, find where quantity is validated and ensure it compares against the product's `moq` field.
- **Quick order SKU validation**: The component should check submitted SKUs against the catalogue data (from the product service). If the check is missing, add: filter submitted SKUs against the list of known product SKUs and flag any that don't match.

### Completion Check

- [ ] Price list loads with correct columns, filter and search work
- [ ] MOQ page has real content
- [ ] Bulk order: product add, MOQ warning, total calculation, submit
- [ ] Quick order: SKU validation, matched products shown
- [ ] Quote request: form submits with confirmation

---

## TASK 9 — Partner Portal: Dropship-Only Features

**Goal**: Dropship-specific pages work correctly.
Log in as `seller@dropstore.co.uk` / `test123`.

### Steps

#### 9A — Dropship Dashboard (`/dashboard/dropship`)

1. Current balance is displayed prominently as a currency amount (e.g., "£450.00")
2. The balance is colour-coded:
   - Green background or green text = healthy (> threshold)
   - Yellow/amber = low balance warning
   - Red = locked (zero or below threshold)
3. A "Top Up" button is visible and links to `/dashboard/dropship/topup`
4. A 30-day balance trend chart/graph is visible (not broken/empty)
5. A "Recent Transactions" list shows at least the transaction type, date, and amount

#### 9B — Low Balance Lock Behaviour

1. If the seed data has a low or zero balance for the dropship user, verify:
   - A warning banner appears at the top of the portal
   - Clicking "New Order" (if visible) shows a blocking message explaining balance is insufficient
   - The "Top Up Now" button in the banner links to the top-up page
2. If balance is healthy in seed data, note this but skip the lock check

#### 9C — Transaction Ledger (`/dashboard/dropship/ledger`)

1. A table is shown with columns: Date, Type, Reference, Amount, Balance
2. Transaction types include: Top-up, Order, Refund, Adjustment
3. Top-up amounts show as positive (e.g., "+£200.00")
4. Order deductions show as negative (e.g., "−£45.00")
5. A date range filter is present
6. A "Download Statement" button is present

#### 9D — Top Up Funds (`/dashboard/dropship/topup`)

1. Current balance is shown at the top
2. Preset amount buttons are shown (e.g., £100, £250, £500)
3. A custom amount input field is present
4. Selecting or entering an amount shows bank transfer details (account name, sort code, account number, reference)
5. A "I've Made the Transfer" or "Confirm" button links to the bank transfer confirmation page

#### 9E — Bank Transfer Confirmation (`/dashboard/dropship/topup/bank-confirm`)

1. A reference number for the bank transfer is shown
2. The amount being confirmed is displayed
3. A file upload area for proof of payment is present
4. A submit button sends the confirmation

#### 9F — Statement (`/dashboard/dropship/statement`)

1. A date range selector is present
2. A "Generate Statement" or "Download" button is present

### Fix If Broken

- **Balance showing as 0 or NaN**: Check `src/services/dropship.service.ts` — verify the mock/API data has a `balance` field that is a number, not a string.
- **Balance colour not changing**: In `DropshipDashboardPage.tsx`, find the colour logic. It likely compares `balance` against a threshold (e.g., 100). Verify the comparison uses the correct field name.
- **Chart not rendering**: If using recharts, ensure the data array passed to the chart has the correct `{ date, balance }` shape. If the array is empty, the chart renders blank — add at least a few mock data points.
- **Top-up amount not showing bank details**: In `TopUpPage.tsx`, verify there's a state variable that toggles the bank details section visible when an amount is selected.

### Completion Check

- [ ] Dropship dashboard: balance visible with correct colour, chart visible, recent transactions listed
- [ ] Low balance: warning banner appears, order placement blocked
- [ ] Ledger: table with type, amounts (positive/negative), date filter
- [ ] Top up: preset amounts, custom input, bank details appear, leads to confirmation
- [ ] Bank confirm: reference shown, file upload present
- [ ] Statement: date range + download button present

---

## TASK 10 — Admin Panel: Content Management

**Goal**: Admin CMS screens for categories, products, pages, FAQ, and media all work.
Log in as `admin@homatz.com` / `admin123`.

### Steps

#### 10A — Categories (`/admin/categories`)

1. A list of all categories is shown (Kitchen & Household, Mats & Rugs, etc.)
2. An "Add Category" button opens the category edit form
3. Clicking "Edit" on an existing category pre-fills all fields
4. Change the description on "Kitchen & Household" and save — **Expected**: Save succeeds, no error
5. A "Preview" link opens the live category page in a new tab
6. A "Delete" button asks for confirmation before removing

#### 10B — Products (`/admin/products`)

1. A list of all product families is shown
2. A category filter dropdown filters by category
3. A search input filters by product name
4. Clicking "Edit" on a product pre-fills the form
5. The product form includes: image gallery management, features list, spec table (key-value), variants
6. A "Preview" link opens the live product page

#### 10C — Pages (`/admin/pages`)

1. A list of CMS pages is shown (About, How It Works, FAQ, etc.)
2. Clicking a page opens an edit form with the current content
3. A Publish/Draft status toggle is visible
4. Saving a page shows a success confirmation

#### 10D — FAQ Management (`/admin/faq`)

1. A list of FAQ items is shown with Question and Answer
2. An "Add FAQ" button opens a form to create a new item
3. A delete button removes an item (with confirmation)
4. Items can be reordered

#### 10E — Media Library (`/admin/media`)

1. Uploaded images are shown in a grid
2. An "Upload" button opens a file picker
3. Uploading an image adds it to the grid immediately
4. Clicking an image shows a larger preview and a "Copy URL" button

### Fix If Broken

- **Category list empty**: Check that the seed data ran (`cd server && npm run db:seed`). If seed ran but list is still empty, check the API endpoint `GET /api/categories` is wired to the admin route and returns data.
- **Edit form not pre-filling**: The `CategoryEditPage.tsx` should fetch the category by slug on mount using `useEffect`. If the form is blank, check the fetch call and that it maps API fields to form state.
- **FAQ reorder not saving**: If drag-and-drop reorder works visually but doesn't persist, the `onDragEnd` handler needs to call the API `PATCH /api/faq/reorder` with the new order.
- **Media upload failing**: Check the upload endpoint `POST /api/media/upload`. The backend uses `multer` for file handling. Ensure `UPLOAD_DIR` exists (`./uploads` inside the server directory).

### Completion Check

- [ ] Category list loads, edit pre-fills, save works, preview opens correct page
- [ ] Product list loads, edit pre-fills, spec table and variants editable
- [ ] Pages list loads, edit works, publish/draft toggle visible
- [ ] FAQ: add, edit, delete, reorder all work
- [ ] Media: upload works, grid shows uploaded files

---

## TASK 11 — Admin Panel: Partner Management

**Goal**: Application review and partner management flows work correctly.

### Steps

#### 11A — Partner Applications (`/admin/partners/applications`)

1. Any pending applications are listed (submit a new application in another tab to create one)
2. Clicking an application shows the full details the applicant submitted
3. An "Approve" button is present — clicking it:
   - Shows a confirmation step (not an immediate action)
   - On confirm: application status changes to Approved
   - The applicant moves out of the pending list
4. A "Reject" button is present — clicking it:
   - Asks for a rejection reason (text field)
   - On confirm with reason: application changes to Rejected
   - The applicant moves out of the pending list

**To test**: Open `/apply/wholesale` in an incognito window, submit a new application, then check this admin page.

#### 11B — Approved Partners (`/admin/partners`)

1. A list of approved partners is shown with: Company, Type, Joined Date, Status, Last Order
2. Clicking a partner shows their full profile
3. A "Suspend" button is present — clicking asks for confirmation
4. A "Reactivate" button appears for suspended partners
5. After suspending, log in as that partner — **Expected**: Redirected to `/apply/restricted`
6. After reactivating, log in again — **Expected**: Back in the dashboard

#### 11C — Roles & Permissions (`/admin/partners/roles`)

1. Page loads showing available roles (ADMIN, PARTNER)
2. Permission rules are listed

### Fix If Broken

- **Applications list empty after submitting**: Check `GET /api/admin/partners/applications` returns the new submission. Verify the `apply` form posts to the correct endpoint (`POST /api/auth/register` or `POST /api/auth/apply`).
- **Approve/Reject not updating status**: The admin action should call `PATCH /api/admin/partners/:id/approve` or `/reject`. Check the route is registered in `server/src/routes/admin/partners.ts`.
- **Suspend not affecting login**: After suspension, the API `GET /api/auth/me` should return `approvalStatus: 'SUSPENDED'`. The `AuthContext` reads this on every page load and the `AuthGuard` redirects accordingly.

### Completion Check

- [ ] Pending application visible, approve flow works, reject with reason works
- [ ] Partner list shows approved partners, suspend/reactivate changes login access
- [ ] Roles page loads

---

## TASK 12 — Admin Panel: Operations

**Goal**: Order workflow, operations dashboard, returns, logs, and admin support all work.

### Steps

#### 12A — Order Workflow (`/admin/operations/orders`)

1. Orders are shown in a board or table view
2. Order statuses visible: New, Processing, Packed, Shipped, Delivered
3. An order can be moved to the next status (button or drag-and-drop)
4. Clicking an order shows full details
5. An "Internal Notes" field (not visible to the partner) is present
6. A bulk status update option is present (select multiple → update all)

#### 12B — Operations Dashboard (`/admin/operations/dashboard`)

1. A chart or KPI cards show: orders by status, pending fulfilment count, average fulfilment time
2. Open support ticket count is visible
3. A recent activity feed shows recent actions

#### 12C — Returns (`/admin/operations/returns`)

1. A list of returns is shown with: Return #, Order #, Partner, Reason, Status
2. A "Create Return" button opens a form to log a return against an order
3. Status can be updated: Reported → Investigating → Resolved / Rejected
4. Internal notes can be added
5. Resolution actions are available: Refund, Replacement, Credit

#### 12D — Activity Log (`/admin/operations/logs`)

1. A chronological log of admin actions is displayed
2. Each entry shows: Action, User, Date/Time, Affected item
3. Filters for action type, user, and date range are present
4. An "Export CSV" button is present

#### 12E — Admin Support (`/admin/operations/support`)

1. All support tickets from all partners are listed
2. Can be filtered by status, priority, partner
3. Ticket can be assigned to an agent
4. Internal notes can be added
5. Admin can reply to a ticket — verify the reply appears in the partner's ticket thread

### Fix If Broken

- **Order workflow status update not persisting**: The status change should call `PATCH /api/orders/:id/status`. Check `server/src/routes/orders.ts` for this endpoint.
- **Returns form not linked to orders**: The "Related Order" field should autocomplete or allow entering an order ID. If missing, add a plain text input for the order number.
- **Activity log empty**: The log is populated by admin actions. If actions are being taken but not logged, check `server/src/services/operations.service.ts` — verify `createLog()` is called within the admin route handlers.

### Completion Check

- [ ] Order workflow: status changes, internal notes, bulk update
- [ ] Ops dashboard: KPI charts/cards visible
- [ ] Returns: create, status update, resolution actions
- [ ] Activity log: entries visible, filtered by type/date, CSV export present
- [ ] Admin support: reply from admin appears in partner's thread

---

## TASK 13 — Branding & Whitelabel

**Goal**: Brand settings page works and brand values are consumed from context (not hardcoded).

### Steps

1. Visit `/admin/brand` (if linked from the admin sidebar) or find the brand settings page.
2. Verify the page shows: Brand Name, Logo upload, Primary Colour, Accent Colour
3. Change the Brand Name to "TEST BRAND" and save
4. Refresh the page — **Expected**: The header/top bar reflects the updated brand name
5. Change the Brand Name back to "HOMATZ" and save

**Check `BrandContext` is wired:**
1. Read `src/contexts/BrandContext.tsx`
2. Verify `useBrand()` hook is used in `Header.tsx` for the brand name (not the string `"HOMATZ"` hardcoded)
3. If hardcoded, replace with `const { brandName } = useBrand();` and render `{brandName}`

### Fix If Broken

- **Brand settings page not in sidebar**: Check `src/layouts/AdminLayout.tsx` — add a "Brand Settings" link to the admin sidebar pointing to `/admin/brand`.
- **Brand name not updating in Header**: In `src/app/components/Header.tsx`, replace any hardcoded `"HOMATZ"` strings with the `brandName` value from `useBrand()`.

### Completion Check

- [ ] Brand settings page loads and saves changes
- [ ] Header uses `brandName` from `BrandContext` (not hardcoded)
- [ ] Changing brand name in admin reflects in the header after refresh

---

## TASK 14 — Responsive Design Check

**Goal**: The platform is usable on mobile and tablet screen sizes.

### Steps

Open browser DevTools (F12) → click the device toggle icon (📱) → test at these sizes:
- **375px wide** (iPhone SE)
- **768px wide** (iPad portrait)
- **1024px wide** (iPad landscape)

For each size, check:

| Page | Check |
|------|-------|
| Homepage | Hero text readable, grid columns collapse, footer stacks |
| Category page | Product cards form a readable grid (not overflowing) |
| Product page | Gallery usable, spec table scrolls horizontally |
| Login page | Form fits, buttons full width |
| Apply forms | All fields visible, no cut-off inputs |
| Partner dashboard | Sidebar collapses to hamburger or bottom nav |
| Orders list | Table scrolls horizontally or collapses to card view |
| Dropship dashboard | Balance and chart visible without horizontal scroll |
| Admin sidebar | Collapses on tablet and mobile |

### Fix If Broken

- **Sidebar not collapsing on mobile**: In `src/layouts/PortalLayout.tsx`, verify a `useState` toggle controls sidebar visibility and the hamburger button (`☰`) is rendered on small screens with `className="md:hidden"`.
- **Table overflowing**: Wrap the table in `<div className="overflow-x-auto">...</div>`.
- **Form fields cut off**: Check for missing `w-full` class on inputs or fixed widths that don't respect the viewport.

### Completion Check

- [ ] Homepage responsive at 375px, 768px, 1024px
- [ ] Portal sidebar collapses to hamburger on mobile
- [ ] Tables scroll horizontally on mobile rather than overflowing
- [ ] Forms fully usable on phone keyboard

---

## TASK 15 — Final Build & Type Check

**Goal**: Zero errors in the final build before declaring the QA pass complete.

### Steps

1. Stop any running dev servers.

2. Frontend production build:
   ```bash
   npm run build
   ```
   **Expected**: Completes with 0 errors. Note the bundle sizes — flag anything over 2MB as a potential issue.

3. Frontend type check:
   ```bash
   npx tsc --noEmit
   ```
   **Expected**: No output (0 errors).

4. Backend type check:
   ```bash
   cd server && npm run lint
   ```
   **Expected**: No output (0 errors).

5. Check for leftover `console.log` statements:
   ```bash
   grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
   ```
   **Expected**: No results (or only intentional debug logs — remove all that are not intentional).

6. Check for `any` types:
   ```bash
   grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
   ```
   Review each hit — replace with the correct type or `unknown` if the type is genuinely uncertain.

7. Restart both dev servers and do a final smoke test:
   - Homepage loads ✓
   - Login as admin → `/admin` ✓
   - Login as wholesale partner → `/dashboard` ✓
   - Login as dropship partner → `/dashboard/dropship` ✓
   - Log out from each ✓

### Fix If Broken

Work through each error listed by the TypeScript compiler. They will point to exact file and line numbers. Fix each one before re-running.

### Completion Check

- [ ] `npm run build` — 0 errors
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `cd server && npm run lint` — 0 errors
- [ ] No stray `console.log` calls
- [ ] No `: any` types
- [ ] Final smoke test passes for all three user roles

---

## QA Summary

Fill this in as tasks are completed.

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Environment & servers start | ⬜ | |
| 2 | TypeScript build passes | ⬜ | |
| 3 | Admin login redirect fixed | ⬜ | |
| 4 | Apply forms (wholesale & dropship) | ⬜ | |
| 5 | All public pages load | ⬜ | |
| 6 | Auth flows (all roles) | ⬜ | |
| 7 | Portal: all-partner pages | ⬜ | |
| 8 | Portal: wholesale-only pages | ⬜ | |
| 9 | Portal: dropship-only pages | ⬜ | |
| 10 | Admin: content management | ⬜ | |
| 11 | Admin: partner management | ⬜ | |
| 12 | Admin: operations | ⬜ | |
| 13 | Branding & whitelabel | ⬜ | |
| 14 | Responsive design | ⬜ | |
| 15 | Final build & type check | ⬜ | |

**Legend**: ⬜ Not started · 🔄 In progress · ✅ Passed · ❌ Failed (see Notes)
