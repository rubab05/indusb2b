# HOMATZ B2B Platform — End-User QA Checklist

*For a non-technical tester. Tick each item only if it works exactly as described. Flag anything that looks broken, confusing, or missing.*

---

## Section 1 — Public Website (No Login Required)

### 1.1 Homepage

- [ ] The page loads without any blank sections or error messages
- [ ] The main banner/hero area shows a headline, description, and a button
- [ ] Clicking the "Apply" or "Get Access" button takes you to the application page
- [ ] Featured categories are visible and clicking one takes you to that category
- [ ] The header shows the HOMATZ logo and navigation links
- [ ] The footer is visible at the bottom with links and contact info
- [ ] The page looks correct on a phone (nothing is cut off or overlapping)

### 1.2 Navigation

- [ ] Clicking the logo always takes you back to the homepage
- [ ] The "Categories" link shows a dropdown or takes you to a categories list
- [ ] All 5 category links work: Mats & Rugs, Decoration & Seasonal, Kitchen & Household, Garden & Outdoor, Toys & Games
- [ ] "Trade" or "Apply" link takes you to the application landing page
- [ ] "About" link takes you to the About page
- [ ] "Contact" link takes you to the Contact page
- [ ] On mobile, a hamburger menu (☰) appears and opens the nav when tapped
- [ ] All mobile nav links work and the menu closes after tapping a link

### 1.3 Category Pages (repeat for each of the 5 categories)

- [ ] The category page loads with a hero image and title
- [ ] A description of the category is shown
- [ ] Product cards/tiles are displayed in a grid
- [ ] Clicking a product card takes you to that product's detail page
- [ ] Breadcrumbs at the top show: Home > [Category Name]
- [ ] The page looks correct on a phone

### 1.4 Product Detail Pages

- [ ] Product name and a main image are shown
- [ ] Multiple product images can be clicked to preview (gallery works)
- [ ] A product description is visible
- [ ] A specifications table is present (dimensions, materials, etc.)
- [ ] Variants (sizes, colours) are listed if applicable
- [ ] An "Enquire" or "Request a Quote" button is present
- [ ] Clicking the enquiry button opens a contact/enquiry form
- [ ] Breadcrumbs show: Home > [Category] > [Product Name]
- [ ] A "Related Products" section is visible at the bottom
- [ ] The page looks correct on a phone

### 1.5 Enquiry Form (on Product Page)

- [ ] The form has fields for: Name, Company, Email, Message
- [ ] Submitting the form without filling required fields shows error messages
- [ ] After filling all fields and clicking Submit, a success message appears
- [ ] The form does not submit if the email address is not in the correct format (e.g. missing @)

### 1.6 Informational Pages

- [ ] **/about** — Page loads with company information (no blank sections)
- [ ] **/how-it-works** — Page explains the wholesale and dropship process
- [ ] **/faq** — FAQ page loads with questions and answers
- [ ] **/shipping** — Shipping policy is visible
- [ ] **/returns** — Returns policy is visible
- [ ] **/privacy-policy** — Privacy policy is readable
- [ ] **/terms** — Terms & conditions are readable
- [ ] **/contact** — Contact page loads with a form and contact details

### 1.7 Contact Page

- [ ] A contact form is visible with fields for Name, Email, Company, Message
- [ ] Submitting without required fields shows clear error messages
- [ ] A valid submission shows a success confirmation
- [ ] A phone number or email address for the trade team is shown on the page

---

## Section 2 — Applying for an Account

### 2.1 Application Landing Page (/apply)

- [ ] The page clearly explains the difference between Wholesale and Dropship
- [ ] Two clear options/buttons are shown: "Apply as Wholesaler" and "Apply as Dropshipper"
- [ ] Both buttons take you to their respective application forms

### 2.2 Wholesale Application Form (/apply/wholesale)

- [ ] The form loads correctly with no missing sections
- [ ] The following fields are present: Company Name, Company Registration Number, Business Address, City, Postcode, Contact Name, Email, Phone, Business Type (dropdown), Annual Revenue Range (dropdown), Categories of Interest (checkboxes), Trade References (optional)
- [ ] A "Terms and Conditions" checkbox is present and must be ticked before submitting
- [ ] Submitting the form without filling required fields shows red error messages next to the missing fields
- [ ] Entering an invalid email format shows an error
- [ ] Filling all fields correctly and submitting takes you to a "Pending" page
- [ ] The submit button shows a loading spinner while processing
- [ ] The form does not allow double-submission (button disables after first click)

### 2.3 Dropship Application Form (/apply/dropship)

- [ ] The form loads correctly
- [ ] Fields include: Company Name, Registration Number, Address, City, Postcode, Contact Name, Email, Phone, Store/Website URL, Selling Platform (dropdown: Shopify / WooCommerce / eBay / Amazon / Etsy / Custom), Estimated Monthly Orders, Categories of Interest
- [ ] Terms checkbox is present and required
- [ ] Invalid URL format in the website field shows an error
- [ ] All required field validation works (same behaviour as wholesale form)
- [ ] Successful submission redirects to the "Application Pending" page

### 2.4 Application Pending Page (/apply/pending)

- [ ] A clear confirmation message is shown (e.g. "Your application is under review")
- [ ] An application reference number or confirmation detail is displayed
- [ ] The expected review timeline is mentioned (e.g. 24–48 hours)
- [ ] A "What happens next" explanation is visible
- [ ] A link to contact support is present

### 2.5 Application Rejected/Suspended Page (/apply/restricted)

- [ ] A clear message explains the account is restricted or application was not approved
- [ ] A reason is shown if one was provided by the admin
- [ ] A link to contact support is present
- [ ] An option to re-apply or appeal is shown

---

## Section 3 — Login & Password

### 3.1 Login Page (/login)

- [ ] The login page loads with an Email and Password field
- [ ] A "Remember me" checkbox is present
- [ ] A "Forgot password?" link is present and clickable
- [ ] A link to apply for an account is present
- [ ] Entering wrong credentials shows a clear error message (not a blank page or crash)
- [ ] Entering no credentials and clicking Login shows validation errors
- [ ] After successful login as a **Wholesale partner**: you are taken to the Partner Dashboard
- [ ] After successful login as a **Dropship partner**: you are taken to the Partner Dashboard
- [ ] After successful login as an **Admin**: you are taken to the Admin panel
- [ ] A **Pending** user who logs in is redirected to the Pending page, not the dashboard
- [ ] A **Rejected/Suspended** user who logs in is redirected to the Restricted page

### 3.2 Forgot Password (/forgot-password)

- [ ] The page loads with an email input field
- [ ] Submitting a valid email shows a success message ("Check your inbox")
- [ ] Submitting an invalid email format shows an error
- [ ] A "Back to login" link is present

### 3.3 Reset Password (/reset-password)

- [ ] The page accepts a new password and a "confirm password" field
- [ ] If the two passwords don't match, an error is shown
- [ ] A password that is too short or too weak shows a warning
- [ ] Submitting a valid new password shows a success message and offers a link to log in

### 3.4 Session Behaviour

- [ ] Refreshing the browser while logged in keeps you logged in (session persists)
- [ ] Closing and reopening the browser tab while logged in keeps you logged in (if "Remember me" was checked)
- [ ] Typing the dashboard URL directly while logged out redirects you to the login page
- [ ] Typing the admin URL while logged in as a partner redirects you away (no admin access)

---

## Section 4 — Partner Portal — All Partners (Wholesale & Dropship)

### 4.1 Layout & Navigation

- [ ] After login, a sidebar appears on the left with navigation links
- [ ] Your company name and account type (WHOLESALE or DROPSHIP) badge are visible at the top
- [ ] The sidebar shows the correct links for your account type (see Sections 5 & 6 for role-specific items)
- [ ] Clicking "Sign Out" in the sidebar logs you out and takes you to the login page
- [ ] On mobile, the sidebar is replaced by a hamburger menu or bottom navigation bar
- [ ] All sidebar links open the correct pages

### 4.2 Dashboard (/dashboard)

- [ ] A welcome message shows your company name
- [ ] An account status card shows your account type and approval date
- [ ] Three stat cards are visible: Total Orders (last 30 days), Pending Orders, Open Support Tickets
- [ ] Quick action buttons are present: e.g. "New Order", "Price List", "Contact Support"
- [ ] A "Recent Orders" table shows the last few orders with their status
- [ ] Clicking a row in the recent orders table takes you to that order's detail page
- [ ] An announcements or notices section is visible (even if empty)

### 4.3 Orders List (/dashboard/orders)

- [ ] A table of all orders is displayed with columns: Order #, Date, Items, Total, Status, Actions
- [ ] Status labels are visible (e.g. Processing, Shipped, Delivered)
- [ ] A search bar lets you search by order number
- [ ] A status filter dropdown lets you filter by order status
- [ ] Pagination works: you can navigate between pages of orders
- [ ] Clicking "View" on an order takes you to the order detail page

### 4.4 Order Detail (/dashboard/orders/:orderId)

- [ ] The order number, date, and current status are shown at the top
- [ ] A list of all items in the order is visible with quantities and prices
- [ ] A delivery address is shown
- [ ] If the order has been shipped, a tracking number or carrier information is shown
- [ ] An order status timeline (history) is visible at the bottom
- [ ] A "Download Invoice" button is present
- [ ] A "Re-Order" button is present
- [ ] A "Cancel Order" button is present **only** if the order is in a cancellable status

### 4.5 Invoices (/dashboard/invoices)

- [ ] A table of invoices is shown with columns: Invoice #, Order #, Date, Amount, Status (Paid/Pending/Overdue)
- [ ] Status badges are colour-coded (e.g. green for Paid, red for Overdue)
- [ ] A filter for status and date range is present
- [ ] A "Download" button is present on each invoice row

### 4.6 Tracking (/dashboard/tracking)

- [ ] A list of active shipments is shown
- [ ] Each shipment shows: Order #, Carrier, Tracking Number, Status, ETA
- [ ] Clicking a shipment shows a tracking timeline (e.g. Dispatched → In Transit → Delivered)
- [ ] A link to the carrier's tracking page opens in a new tab (if available)

### 4.7 Support Tickets — List (/dashboard/support)

- [ ] All your support tickets are listed with: Ticket #, Subject, Status, Date, Priority
- [ ] Status labels are colour-coded (Open, In Progress, Resolved, Closed)
- [ ] A filter by status is present
- [ ] A "New Support Request" button is visible and clickable

### 4.8 Support Tickets — Create New (/dashboard/support/new)

- [ ] The form has a Subject field (required)
- [ ] A Category dropdown is present with options: Order Issue, Product Query, Account, Billing, Other
- [ ] An optional "Related Order #" field is present
- [ ] A Description text area is present (required)
- [ ] A file attachment area is present (drag and drop or "Browse" button)
- [ ] Attempting to attach a file over 10MB shows an error message
- [ ] Submitting without required fields shows validation errors
- [ ] Successful submission shows a confirmation and takes you to the ticket list or ticket detail

### 4.9 Support Ticket Detail (/dashboard/support/:ticketId)

- [ ] The ticket subject, category, and current status are shown at the top
- [ ] A message thread is visible with your original message and any replies from support
- [ ] Each message shows the sender name and timestamp
- [ ] A reply text area is at the bottom with a "Send Reply" button
- [ ] Sending a reply adds it to the thread
- [ ] A "Close Ticket" button is present for open tickets

### 4.10 Account Settings (/dashboard/account)

- [ ] The page has sections for: Business Profile, Contact Details, Login & Security
- [ ] Business Profile shows: Company Name, Registration #, Address, Phone, Website
- [ ] An "Edit" button lets you update business profile details
- [ ] Changes can be saved (Save button) or cancelled (Cancel button)
- [ ] Contact Details section shows: Contact Name, Email, Phone
- [ ] Login & Security section has a "Change Password" option
- [ ] A Documents section is visible (even if uploads are not yet enabled)

---

## Section 5 — Wholesale Partner — Specific Features

*Log in as a Wholesale partner to test this section*

### 5.1 Sidebar — Wholesale-Only Items

- [ ] The sidebar shows these extra links: **New Order**, **Quick Order**, **Quote Request**, **Price List**, **MOQ & Rules**
- [ ] The sidebar does NOT show any Dropship-specific links (Balance, Ledger, Top Up)

### 5.2 Price List (/dashboard/price-list)

- [ ] A price list page loads with products, prices, and stock status
- [ ] A category filter lets you view prices by product category
- [ ] A search bar filters products by name or SKU
- [ ] Columns visible: Product Name, SKU, MOQ, Unit Price, Bulk Price, Stock Status
- [ ] A "Download Price List" button is present (CSV or PDF)

### 5.3 MOQ & Ordering Rules (/dashboard/moq-info)

- [ ] The page explains what MOQ (Minimum Order Quantity) means
- [ ] MOQ rules are shown per category or per product
- [ ] Bulk discount tiers are listed
- [ ] Lead times and payment terms are explained

### 5.4 Bulk Order — Create New (/dashboard/orders/new)

- [ ] A product search or category browser is available to find products
- [ ] Adding a product to the order shows it in an order summary on the right
- [ ] Entering a quantity below the MOQ shows a warning or error
- [ ] The running order total updates as products are added
- [ ] A delivery address selector is present
- [ ] An "Order Notes" text field is present
- [ ] Submitting the order shows a confirmation page with an order number
- [ ] The confirmation page has a "Back to Dashboard" link

### 5.5 Quick Order (/dashboard/orders/quick)

- [ ] A text input lets you enter multiple SKU + quantity pairs (one per line or in a table)
- [ ] An option to upload a CSV file of SKU/quantity is present
- [ ] After entering/uploading, clicking "Check Items" validates SKUs against the catalogue
- [ ] Invalid SKUs are flagged with a clear error
- [ ] Valid products are shown with their name, price, and stock status
- [ ] A "Submit Order" button sends the order

### 5.6 Quote Request (/dashboard/quote-request)

- [ ] A form to select products and quantities is present
- [ ] A "Special Requirements" or notes field is available
- [ ] Submitting gives a confirmation with a reference number
- [ ] The page explains that someone from the trade team will follow up

---

## Section 6 — Dropship Partner — Specific Features

*Log in as a Dropship partner to test this section*

### 6.1 Sidebar — Dropship-Only Items

- [ ] The sidebar shows: **Dropship Dashboard**, **Transaction Ledger**, **Top Up Funds**, **Statement**
- [ ] The sidebar does NOT show wholesale-specific links (Bulk Order, Quick Order, Quote Request, Price List, MOQ)

### 6.2 Dropship Dashboard (/dashboard/dropship)

- [ ] The current prepaid balance is shown prominently (large number)
- [ ] The balance is colour-coded:
  - Green = healthy (sufficient funds)
  - Yellow/Amber = low balance warning
  - Red = balance locked (too low to place orders)
- [ ] When balance is low, a warning banner or message is displayed
- [ ] When balance is locked (zero or below threshold), a message prevents placing orders and a "Top Up Now" button is shown
- [ ] A 30-day balance history chart or graph is visible
- [ ] A "Recent Transactions" list shows the last few transactions
- [ ] A "Top Up" button is visible and takes you to the top-up page

### 6.3 Transaction Ledger (/dashboard/dropship/ledger)

- [ ] A table of all transactions is shown with: Date, Type (Top-up / Order / Refund / Adjustment), Reference #, Amount, Running Balance
- [ ] Top-up amounts show as positive (money added)
- [ ] Order deductions show as negative (money spent)
- [ ] A date range filter lets you view transactions for a specific period
- [ ] A "Download Statement" button is present

### 6.4 Top Up Funds (/dashboard/dropship/topup)

- [ ] The current balance is displayed at the top
- [ ] Preset top-up amount buttons are shown (e.g. £100, £250, £500)
- [ ] A custom amount field lets you enter any amount
- [ ] After choosing an amount, bank transfer details (account name, sort code, account number, reference) are displayed
- [ ] A "I've Made the Transfer" or "Confirm" button takes you to the confirmation page

### 6.5 Bank Transfer Confirmation (/dashboard/dropship/topup/bank-confirm)

- [ ] A reference number is shown (to use as payment reference when transferring)
- [ ] The amount to transfer is confirmed
- [ ] An option to upload proof of payment (receipt/screenshot) is present
- [ ] A submit button sends the confirmation to the HOMATZ team
- [ ] A success message appears after submission

### 6.6 Balance Statement (/dashboard/dropship/statement)

- [ ] A date range selector is present
- [ ] A "Generate Statement" button creates a downloadable statement (PDF or CSV)
- [ ] The statement covers the selected date range

### 6.7 Low Balance Lock Behaviour

- [ ] When balance is too low, a banner warning appears across the entire portal
- [ ] Attempting to place a new order when balance is locked shows a clear blocking message
- [ ] The blocked message includes a "Top Up Now" button that links to the top-up page
- [ ] Once balance is topped up (in test mode), the lock is removed

---

## Section 7 — Admin Panel

*Log in as an Admin to test this section*

### 7.1 Admin Layout & Access

- [ ] Visiting /admin while not logged in redirects to the login page
- [ ] Visiting /admin while logged in as a partner (not admin) redirects away with an access denied message
- [ ] After admin login, the admin sidebar navigation is visible
- [ ] The admin sidebar is organised into sections: Content, Partners, Commerce, Operations
- [ ] A "View Live Site" link opens the public website in a new tab

### 7.2 Partner Applications (/admin/partners/applications)

- [ ] A list of pending applications is shown with: Company Name, Account Type (Wholesale/Dropship), Date Applied, Status
- [ ] Clicking an application shows full application details (all the fields the applicant filled in)
- [ ] An "Approve" button is present — clicking it changes the status to Approved
- [ ] A "Reject" button is present — clicking it asks for a reason (text field) before confirming
- [ ] After approving or rejecting, the application moves out of the pending list
- [ ] A confirmation step prevents accidental approval/rejection

### 7.3 Approved Partners (/admin/partners)

- [ ] A list of approved partners shows: Company Name, Type, Join Date, Status, Last Order date
- [ ] Clicking a partner shows their full profile and order history
- [ ] A "Suspend" button is present — clicking asks for confirmation
- [ ] A "Reactivate" button is shown for suspended partners
- [ ] An option to change the account type (Wholesale ↔ Dropship) is present

### 7.4 Content — Categories (/admin/categories)

- [ ] A list of all product categories is shown
- [ ] An "Add Category" button opens a form to create a new category
- [ ] The category form has fields for: Name, Slug, Hero Image, Description, Intro Text, SEO fields
- [ ] Editing an existing category pre-fills the form with current data
- [ ] Saving a category updates it immediately in the list
- [ ] A "Delete" option asks for confirmation before removing
- [ ] A "Preview" link opens the live category page in a new tab

### 7.5 Content — Products (/admin/products)

- [ ] A list of all product families is shown with a category filter
- [ ] An "Add Product" button opens the product creation form
- [ ] The form includes: Name, Slug, Category, Summary, Long Description, Image Gallery, Features, Specs Table, Variants
- [ ] Images can be added and reordered in the gallery
- [ ] The Specs Table allows adding/removing rows (key-value pairs)
- [ ] Variants can be added/removed
- [ ] Saving updates the product in the list
- [ ] A "Preview" link opens the live product page

### 7.6 Content — Pages (/admin/pages)

- [ ] A list of CMS pages is shown (About, How It Works, FAQ, etc.)
- [ ] Clicking a page opens a rich text editor with the current content
- [ ] Changes can be saved with a "Save" button
- [ ] A "Publish" / "Draft" toggle is visible
- [ ] Unpublished pages do not appear on the public site

### 7.7 Content — FAQ (/admin/faq)

- [ ] FAQ items are listed and can be added, edited, deleted
- [ ] FAQ items can be reordered (drag and drop or up/down arrows)
- [ ] FAQ items can be grouped into categories

### 7.8 Content — Media Library (/admin/media)

- [ ] A grid of uploaded images and files is shown
- [ ] An "Upload" button lets you select files from your device
- [ ] Uploaded files appear in the library immediately
- [ ] Clicking a file shows a preview and its URL (to copy)
- [ ] A delete option removes files (with confirmation)

### 7.9 Pricing Rules (/admin/pricing)

- [ ] Pricing rules per category and product are visible
- [ ] MOQ rules can be set per category or product
- [ ] Bulk discount tiers can be configured (e.g. 10 units = 5% off, 50 units = 10% off)
- [ ] Pricing visibility can be controlled by partner type

### 7.10 Vendors (/admin/vendors)

- [ ] A list of vendors/suppliers is shown
- [ ] Vendors can be added, edited, and deleted
- [ ] Each vendor has: Name, Contact Info, Notes, Linked Products

### 7.11 Operations — Order Workflow (/admin/operations/orders)

- [ ] Orders are displayed in a workflow view (either Kanban columns or a filterable table)
- [ ] Order statuses are: New, Processing, Packed, Shipped, Delivered
- [ ] An order can be moved to the next status
- [ ] Clicking an order shows full order details
- [ ] A section for internal notes (not visible to the partner) is present
- [ ] Bulk status update is possible (select multiple orders → update status)

### 7.12 Operations — Dashboard (/admin/operations/dashboard)

- [ ] A chart or summary showing orders by status is visible
- [ ] A "Pending Fulfilment" count is shown prominently
- [ ] Average fulfilment time stat is shown
- [ ] Open support tickets count is visible
- [ ] A recent activity feed shows the latest actions

### 7.13 Operations — Returns (/admin/operations/returns)

- [ ] A list of returns is shown with: Return #, Order #, Partner Name, Reason, Status, Date
- [ ] A "Create Return" button opens a form to log a new return against an order
- [ ] Return statuses are: Reported → Investigating → Resolved / Rejected
- [ ] Status can be updated on each return
- [ ] Internal notes can be added
- [ ] Resolution action options are present: Refund, Replacement, Credit

### 7.14 Operations — Activity Log (/admin/operations/logs)

- [ ] A chronological log of all admin actions is displayed
- [ ] Each entry shows: Action Type, Who performed it, When, What was affected
- [ ] Filters for action type, user, and date range are present
- [ ] An "Export CSV" button downloads the log

### 7.15 Operations — Support Management (/admin/operations/support)

- [ ] All support tickets from all partners are listed
- [ ] Tickets can be filtered by status, priority, category, and partner
- [ ] Tickets can be assigned to a support agent
- [ ] Internal notes (not visible to the partner) can be added
- [ ] Priority can be escalated
- [ ] SLA indicators show time since ticket was opened
- [ ] Admin can reply to a partner's ticket from this view

---

## Section 8 — Cross-Cutting Checks (All User Types)

### 8.1 Error Handling

- [ ] Typing a non-existent URL (e.g. /gibberish) shows a friendly 404 "Page Not Found" page with a link home
- [ ] If the site has trouble loading data, a clear error message appears (not a blank page or crash)
- [ ] If a form submission fails (server error), a user-friendly error message is shown

### 8.2 Security & Access Control

- [ ] A logged-out user cannot access any /dashboard URL — they are sent to /login
- [ ] A Wholesale partner cannot access any /dashboard/dropship URLs
- [ ] A Dropship partner cannot access any wholesale-only URLs (price list, bulk order, quick order, quote request, MOQ info)
- [ ] A Partner cannot access any /admin URLs
- [ ] A Pending user cannot access the dashboard — they see the pending page
- [ ] A Rejected user cannot access the dashboard — they see the restricted page

### 8.3 Responsive Design (test on phone and tablet)

- [ ] All public pages are usable on a mobile phone screen (nothing overflows or is hidden)
- [ ] The partner portal is usable on a phone (sidebar becomes a menu, tables scroll horizontally)
- [ ] Forms are easy to fill in on a phone keyboard
- [ ] Buttons are large enough to tap on a phone
- [ ] The admin panel is usable on a tablet-sized screen

### 8.4 Branding & Consistency

- [ ] The logo is visible on every page (public site, portal, admin)
- [ ] The same colour scheme (white/light background, dark grey text, yellow accents) is used throughout the public site
- [ ] The portal uses a consistent professional style throughout
- [ ] No page shows the text "Lorem ipsum" or "[PLACEHOLDER]" or "TODO"
- [ ] All images load (no broken image icons)
- [ ] All buttons and links have clear, descriptive labels (no "Click here")

### 8.5 Performance & Load

- [ ] Every page loads within 5 seconds on a normal connection
- [ ] Navigating between pages feels instant (no long blank loading screens)
- [ ] Images do not make the page shift around while loading (no layout jump)

---

## Section 9 — End-to-End User Journey Tests

*These test complete workflows from start to finish.*

### Journey 1 — New Wholesale Partner

1. [ ] Visit the homepage
2. [ ] Click Apply → Choose "Apply as Wholesaler"
3. [ ] Complete and submit the wholesale application form
4. [ ] Confirm you land on the Pending page
5. [ ] (Admin) Log in as admin → go to Partner Applications → Approve the application
6. [ ] (Partner) Log back in → confirm you land on the Dashboard (not the Pending page)
7. [ ] Browse the Price List
8. [ ] Create a new Bulk Order
9. [ ] View the order in the Orders list
10. [ ] Open a Support Ticket about the order
11. [ ] (Admin) Reply to the support ticket from the Admin panel
12. [ ] (Partner) View the reply in the ticket detail
13. [ ] Download an invoice for the order
14. [ ] Check the Tracking page for shipment status

### Journey 2 — New Dropship Partner

1. [ ] Visit the homepage
2. [ ] Click Apply → Choose "Apply as Dropshipper"
3. [ ] Complete and submit the dropship application form
4. [ ] Confirm you land on the Pending page
5. [ ] (Admin) Approve the application
6. [ ] (Partner) Log back in → confirm the Dropship Dashboard is shown
7. [ ] Check the current balance
8. [ ] Go to Top Up Funds → enter an amount → get bank transfer details
9. [ ] Complete the bank transfer confirmation step
10. [ ] Check the Transaction Ledger shows the pending top-up
11. [ ] Verify a low balance warning appears if balance is below threshold
12. [ ] Download a balance statement

### Journey 3 — Rejected Applicant

1. [ ] Submit a wholesale application
2. [ ] (Admin) Reject the application with a reason
3. [ ] (Applicant) Try to log in → confirm you see the Restricted page with the rejection reason
4. [ ] Confirm you cannot access the dashboard or any portal page

### Journey 4 — Admin Content Update

1. [ ] Log in as admin
2. [ ] Go to Categories → Edit the "Kitchen & Household" category → change the description → save
3. [ ] Click "Preview" → verify the change appears on the live category page
4. [ ] Go to Products → Edit a product → add a new feature bullet → save → preview
5. [ ] Go to FAQ → Add a new FAQ item → verify it appears on the public /faq page
6. [ ] Go to Media → Upload a new image → copy the URL → verify the image is accessible

### Journey 5 — Partner Suspension

1. [ ] Log in as an approved Wholesale partner → confirm dashboard access
2. [ ] (Admin) Go to Partners → find the partner → click Suspend → confirm
3. [ ] (Partner) Refresh the page → confirm they are redirected to the Restricted page
4. [ ] (Admin) Reactivate the partner
5. [ ] (Partner) Log in again → confirm dashboard access is restored

---

*Mark each box only when it has been confirmed working in the live/deployed environment. Log the URL, date tested, and tester name next to any item that fails.*
