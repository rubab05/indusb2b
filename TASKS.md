# HOMATZ B2B Platform — Master Task Document

> **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI + react-router 7
> **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL + JWT
> **Branch**: `b2b-rf`
> **Model Target**: Claude Sonnet 4.6 / Claude Code
> **Last Updated**: 2026-04-05

---

## Table of Contents

1. [How to Use This Document](#how-to-use-this-document)
2. [Multi-Agent Strategy](#multi-agent-strategy)
3. [Current Project State](#current-project-state)
4. [Architecture Reference](#architecture-reference)
5. [Task 14: Dropship Balance & Ledger](#task-14--dropship-balance--ledger)
6. [Task 15: Admin Layout & Content CMS](#task-15--admin-layout--content-cms)
7. [Task 16: Admin Partners, Pricing, Vendors, Whitelabel](#task-16--admin-partners-pricing-vendors-whitelabel)
8. [Task 17: Operations & Internal Management](#task-17--operations--internal-management)
9. [Task 18: Final QA & Production Readiness](#task-18--final-qa--production-readiness)
10. **--- Backend Tasks ---**
11. [Task 19: Backend Foundation & Database](#task-19--backend-foundation--database)
12. [Task 20: Auth API & JWT](#task-20--auth-api--jwt)
13. [Task 21: Content & Catalog API](#task-21--content--catalog-api)
14. [Task 22: Partner & Commerce API](#task-22--partner--commerce-api)
15. [Task 23: Admin & Operations API](#task-23--admin--operations-api)
16. [Task 24: File Uploads & Email](#task-24--file-uploads--email)
17. [Task 25: Frontend-Backend Integration](#task-25--frontend-backend-integration)
18. [Task 26: Backend QA & Deployment](#task-26--backend-qa--deployment)
19. [Agent Prompts — Quick Copy](#agent-prompts--quick-copy)
20. [Rules Reminder](#rules-reminder)

---

## How to Use This Document

Each task is a self-contained unit of work. Copy the relevant task section into Claude Code as your prompt. Tasks are ordered by dependency — but many can run in **parallel** using the multi-agent strategy below.

**For each task, the agent should:**
1. Read all referenced files before making changes
2. Reuse existing components — search with `grep -r "ComponentName" src/` before creating
3. Run `npm run build` and `npx tsc --noEmit` after completion
4. Never modify locked pages (Homepage, Kitchen & Household category, Stock Pot product)
5. Keep content in TS data files, not hardcoded in JSX
6. Use slug-based dynamic routing, not one-off page files
7. Follow the approved design language (white/neutral BGs, dark grey type, yellow accents)

---

## Multi-Agent Strategy

### Dependency Graph

```
=== FRONTEND ===
Task 14 (Dropship)  ─────────────────────────────┐
                                                   │
Task 15 (Admin CMS) ──→ Task 16 (Admin Mgmt) ────┼──→ Task 18 (Frontend QA)
                    ──→ Task 17 (Operations)  ────┘

=== BACKEND (can start in parallel with frontend Wave 2+) ===
Task 19 (Foundation) ──→ Task 20 (Auth API) ──┐
                     ──→ Task 21 (Content API) ┼──→ Task 23 (Admin API) ──→ Task 24 (Uploads/Email)
                     ──→ Task 22 (Commerce API)┘                       ──→ Task 25 (Integration)
                                                                       ──→ Task 26 (Backend QA)
```

### Parallel Execution Plan

Use Claude Code's `Agent` tool with `isolation: "worktree"` to run agents in parallel on independent tasks. Each agent gets its own git worktree to avoid file conflicts.

#### Wave 1 — Run in Parallel (No Dependencies Between Them)

| Agent | Task | Worktree Branch | Files Created/Modified |
|-------|------|-----------------|----------------------|
| **Agent A** | Task 14 — Dropship | `task-14-dropship` | `src/services/dropship.service.ts`, `src/app/pages/portal/Dropship*.tsx`, `src/app/pages/portal/TopUp*.tsx`, `src/app/pages/portal/BankTransfer*.tsx`, `src/app/components/guards/DropshipGuard.tsx`, modifies `src/types/commerce.ts`, `src/layouts/PortalLayout.tsx`, `src/app/routes.tsx` |
| **Agent B** | Task 15 — Admin CMS | `task-15-admin-cms` | `src/layouts/AdminLayout.tsx`, `src/services/admin.service.ts`, `src/app/pages/admin/Category*.tsx`, `src/app/pages/admin/Product*.tsx`, `src/app/pages/admin/Pages*.tsx`, `src/app/pages/admin/FAQ*.tsx`, `src/app/pages/admin/Media*.tsx`, modifies `src/app/routes.tsx` |

**Merge Strategy**: After both complete, merge `task-14-dropship` first, then `task-15-admin-cms`. Resolve conflicts in `routes.tsx` (combine both route additions).

#### Wave 2 — Run in Parallel (Both Depend on Task 15)

| Agent | Task | Worktree Branch | Files Created/Modified |
|-------|------|-----------------|----------------------|
| **Agent C** | Task 16 — Admin Mgmt | `task-16-admin-mgmt` | `src/services/partners.service.ts`, `src/services/pricing-admin.service.ts`, `src/services/vendors.service.ts`, `src/contexts/BrandContext.tsx`, `src/app/pages/admin/Partner*.tsx`, `src/app/pages/admin/Pricing*.tsx`, `src/app/pages/admin/Vendors*.tsx`, `src/app/pages/admin/Brand*.tsx`, modifies `src/app/App.tsx`, `src/app/components/Header.tsx`, `src/app/components/Footer.tsx`, `src/app/routes.tsx` |
| **Agent D** | Task 17 — Operations | `task-17-operations` | `src/services/operations.service.ts`, `src/app/pages/admin/OrderWorkflow*.tsx`, `src/app/pages/admin/OpsDashboard*.tsx`, `src/app/pages/admin/Returns*.tsx`, `src/app/pages/admin/ActivityLog*.tsx`, `src/app/pages/admin/AdminSupport*.tsx`, modifies `src/app/routes.tsx`, `src/layouts/AdminLayout.tsx` |

**Merge Strategy**: Merge `task-16-admin-mgmt` first (has App.tsx changes), then `task-17-operations`. Resolve conflicts in `routes.tsx` and `AdminLayout.tsx`.

#### Wave 3 — Sequential (Depends on All Previous)

| Agent | Task | Branch |
|-------|------|--------|
| **Agent E** | Task 18 — Final QA | `task-18-qa` (or directly on `b2b-rf`) |

### Agent Spawn Commands

Use these in Claude Code to launch parallel agents:

#### Wave 1 Launch (Copy this entire block)
```
Launch two agents in parallel using isolation: "worktree":

Agent A — Task 14 Dropship:
Read TASKS.md section "Task 14 — Dropship Balance & Ledger" and complete ALL steps.
Start by reading: src/types/commerce.ts, src/services/orders.service.ts, src/layouts/PortalLayout.tsx, src/contexts/AuthContext.tsx, src/app/components/guards/WholesaleGuard.tsx, src/app/routes.tsx.
Build all dropship pages, service, guard, and route registration.
Run npm run build && npx tsc --noEmit at the end — 0 errors required.

Agent B — Task 15 Admin CMS:
Read TASKS.md section "Task 15 — Admin Layout & Content CMS" and complete ALL steps.
Start by reading: src/layouts/PortalLayout.tsx, src/app/components/guards/AuthGuard.tsx, src/types/auth.ts, src/lib/content-types.ts, src/content/categories.ts, src/content/product-families.ts, src/app/routes.tsx.
Build admin layout, all CMS pages, admin service, and route registration.
Run npm run build && npx tsc --noEmit at the end — 0 errors required.
```

#### Wave 2 Launch (After Wave 1 merge)
```
Launch two agents in parallel using isolation: "worktree":

Agent C — Task 16 Admin Management:
Read TASKS.md section "Task 16 — Admin Partners, Pricing, Vendors, Whitelabel" and complete ALL steps.
Start by reading: src/layouts/AdminLayout.tsx, src/services/admin.service.ts, src/types/auth.ts, src/types/commerce.ts, src/contexts/AuthContext.tsx, src/app/App.tsx, src/app/routes.tsx.
Build partner management, pricing admin, vendor management, BrandContext, brand settings, and wire Header/Footer to useBrand().
Run npm run build && npx tsc --noEmit at the end — 0 errors required.

Agent D — Task 17 Operations:
Read TASKS.md section "Task 17 — Operations & Internal Management" and complete ALL steps.
Start by reading: src/layouts/AdminLayout.tsx, src/services/orders.service.ts, src/services/support.service.ts, src/types/orders.ts, src/types/support.ts, src/app/routes.tsx.
Build order workflow board, ops dashboard, returns management, activity log, admin support view.
Run npm run build && npx tsc --noEmit at the end — 0 errors required.
```

#### Wave 3 Launch (After Wave 2 merge)
```
Complete Task 18 from TASKS.md — Final QA & Production Readiness.
Read TASKS.md section "Task 18" and work through EVERY section systematically.
This is a comprehensive audit — do not skip any section.
Fix issues as you find them. Run npm run build && npx tsc --noEmit — 0 errors required.
```

#### Backend Wave 4 Launch — Foundation (Can start in parallel with Frontend)

| Agent | Task | Worktree Branch | Files Created/Modified |
|-------|------|-----------------|----------------------|
| **Agent F** | Task 19 — Backend Foundation | `task-19-backend-foundation` | Entire `server/` directory: package.json, tsconfig, Prisma schema, Express setup, Docker compose |

```
Launch one agent with isolation: "worktree":

Agent F — Task 19 Backend Foundation:
Read TASKS.md section "Task 19 — Backend Foundation & Database" and complete ALL steps.
Start by reading: src/types/auth.ts, src/types/orders.ts, src/types/commerce.ts, src/types/support.ts (frontend types to match in DB).
Then read: src/services/*.ts (all mock services — understand data shapes you need to replicate).

Build the entire server/ directory from scratch:
1. package.json, tsconfig.json, .env.example, docker-compose.yml, nodemon.json
2. prisma/schema.prisma — ALL models (User, BusinessProfile, PartnerApplication, Category, Subcategory, ProductFamily, ProductVariant, ContentPage, FAQItem, MediaItem, Order, OrderItem, OrderTimeline, TrackingInfo, Invoice, PriceListItem, PricingRule, MOQRule, BulkDiscountTier, DropshipBalance, Transaction, TopUpRequest, SupportTicket, TicketMessage, TicketInternalNote, ReturnRequest, ReturnNote, Vendor, VendorProductMapping, BrandConfig, ActivityLog, QuoteRequest)
3. prisma/seed.ts — realistic seed data matching frontend mocks (5 users, 5 categories, 16 product families, 10 orders, 5 tickets, dropship data, FAQ, brand config, activity log)
4. src/config/ — env loader with validation, Prisma singleton
5. src/middleware/ — error handler (ApiError + Prisma + Zod mapping), Zod validate, CORS
6. src/utils/ — ApiError class, apiSuccess/apiPaginated helpers, parsePagination, logger
7. src/types/express.d.ts — Request.user augmentation
8. src/app.ts — Express setup with middleware, health check, error handler
9. src/server.ts — entry point

Stack: Express 5, TypeScript (strict), Prisma 6, PostgreSQL 16, Zod 3, bcryptjs.
Test passwords: users = "test123", admin = "admin123".
Do NOT modify any files in src/ (frontend directory).

VERIFY:
- cd server && npm install — succeeds
- npx tsc --noEmit — 0 errors
- docker compose up -d — PostgreSQL starts on :5432
- npx prisma generate && npx prisma db push — schema applied
- npx tsx prisma/seed.ts — all tables seeded
- npm run dev — server starts on :4000
- curl http://localhost:4000/api/health → { "status": "ok" }
```

#### Backend Wave 5 Launch — Parallel APIs (After Wave 4 merge)

| Agent | Task | Worktree Branch | Files Created/Modified |
|-------|------|-----------------|----------------------|
| **Agent G** | Task 20 — Auth API | `task-20-auth-api` | `server/src/routes/auth.ts`, `server/src/middleware/auth.ts`, `server/src/services/auth.service.ts`, `server/src/validators/auth.validators.ts` |
| **Agent H** | Task 21 — Content API | `task-21-content-api` | `server/src/routes/categories.ts`, `server/src/routes/products.ts`, `server/src/routes/pages.ts`, `server/src/routes/faq.ts`, `server/src/services/catalog.service.ts`, `server/src/validators/catalog.validators.ts` |
| **Agent I** | Task 22 — Commerce API | `task-22-commerce-api` | `server/src/routes/orders.ts`, `server/src/routes/invoices.ts`, `server/src/routes/tracking.ts`, `server/src/routes/support.ts`, `server/src/routes/pricing.ts`, `server/src/routes/dropship.ts`, `server/src/services/commerce.service.ts`, `server/src/services/dropship.service.ts`, `server/src/services/support.service.ts`, `server/src/validators/commerce.validators.ts` |

**Merge Strategy**: All three agents work in `server/` directory — zero overlap with frontend `src/`. Each agent creates different route/service files. Only `server/src/app.ts` has merge conflicts (route mounts) — combine all `app.use()` lines.

```
Launch THREE agents in parallel using isolation: "worktree":

Agent G — Task 20 Auth API:
Read TASKS.md section "Task 20 — Auth API & JWT" and complete ALL steps.
Start by reading: server/prisma/schema.prisma (User, BusinessProfile, PartnerApplication models), server/src/app.ts, server/src/config/, server/src/middleware/, server/src/utils/.
Also read: src/types/auth.ts, src/services/auth.service.ts (frontend patterns to match).

CREATE these files:
- server/src/middleware/auth.ts — JWT verify middleware (authenticate), role checks (requireApproved, requireAdmin, requireAccountType)
- server/src/validators/auth.validators.ts — Zod: registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema
- server/src/services/auth.service.ts — register (hash + transaction: User + Profile + Application), login (verify + JWT), getCurrentUser, forgotPassword, resetPassword, changePassword
- server/src/routes/auth.ts — POST /register, POST /login, GET /me, POST /forgot-password, POST /reset-password, POST /change-password, POST /logout

MODIFY: server/src/app.ts — add: app.use('/api/auth', authRoutes);

Do NOT modify frontend src/ or other server/src/routes/ files. Do NOT create files assigned to other agents.

VERIFY:
- POST /api/auth/login { email: "wholesale@test.com", password: "test123" } → JWT + user object
- GET /api/auth/me with Bearer token → user profile (no passwordHash)
- POST /api/auth/register with full body → creates user with PENDING status
- POST /api/auth/login with wrong password → 401
- GET /api/auth/me without token → 401
- cd server && npx tsc --noEmit — 0 errors

---

Agent H — Task 21 Content & Catalog API:
Read TASKS.md section "Task 21 — Content & Catalog API" and complete ALL steps.
Start by reading: server/prisma/schema.prisma (Category, Subcategory, ProductFamily, ProductVariant, ContentPage, FAQItem models), server/src/middleware/ (need auth.ts from Agent G — if not merged yet, create a minimal stub or read the pattern from TASKS.md).
Also read: src/lib/content-types.ts, src/content/categories.ts, src/content/product-families.ts (data shapes to match).

IMPORTANT: If server/src/middleware/auth.ts doesn't exist yet (Agent G hasn't merged), create a temporary import-compatible stub that exports authenticate, requireAdmin. Mark it with a TODO comment so it gets replaced on merge.

CREATE:
- server/src/services/catalog.service.ts — Categories: getCategories, getCategoryBySlug (with subcategories + product count), createCategory, updateCategory, deleteCategory (check no products), reorderCategories. Products: getProducts (filter by category, search, paginate), getProductBySlug (with variants + category), createProduct, updateProduct, deleteProduct, getRelatedProducts. Pages: CRUD. FAQ: CRUD + reorder.
- server/src/validators/catalog.validators.ts — Zod: categorySchema, productSchema, pageSchema, faqSchema
- server/src/routes/categories.ts — GET / (public, published only), GET /:slug (public), POST / (admin), PUT /:slug (admin), DELETE /:slug (admin), PUT /reorder (admin)
- server/src/routes/products.ts — GET / (public, filter+paginate), GET /:slug (public), GET /:slug/related (public), POST / (admin), PUT /:slug (admin), DELETE /:slug (admin)
- server/src/routes/pages.ts — GET / (public), GET /:slug (public), POST / (admin), PUT /:slug (admin), DELETE /:slug (admin)
- server/src/routes/faq.ts — GET / (public, category filter), POST / (admin), PUT /:id (admin), DELETE /:id (admin), PUT /reorder (admin)

MODIFY: server/src/app.ts — mount: /api/categories, /api/products, /api/pages, /api/faq

VERIFY:
- GET /api/categories → published categories array
- GET /api/categories/kitchen-household → category with subcategories + products
- GET /api/products?category=kitchen-household → filtered results with pagination
- POST /api/categories without auth → 401
- POST /api/categories as non-admin → 403
- cd server && npx tsc --noEmit — 0 errors

---

Agent I — Task 22 Partner & Commerce API:
Read TASKS.md section "Task 22 — Partner & Commerce API" and complete ALL steps.
Start by reading: server/prisma/schema.prisma (Order, OrderItem, OrderTimeline, TrackingInfo, Invoice, PriceListItem, PricingRule, DropshipBalance, Transaction, TopUpRequest, SupportTicket, TicketMessage, QuoteRequest models).
Also read: src/types/orders.ts, src/types/commerce.ts, src/types/support.ts, src/services/orders.service.ts, src/services/dropship.service.ts (frontend mocks to match).

IMPORTANT: If server/src/middleware/auth.ts doesn't exist yet (Agent G hasn't merged), create a temporary import-compatible stub that exports authenticate, requireApproved, requireAccountType. Mark with TODO.

CREATE:
- server/src/services/commerce.service.ts — Orders: getOrders(userId, filters), getOrderById(userId, orderId), createOrder (validate items, calc totals, check MOQ, debit dropship balance if applicable, create timeline entry), cancelOrder, reorder. Invoices: getInvoices, getInvoiceById, generateInvoicePDF (placeholder). Tracking: getActiveShipments, getTrackingByOrderId. Pricing: getPriceList (filter by account type visibility), getMOQRules, getBulkDiscountTiers. Quote: createQuoteRequest, getQuoteRequests.
- server/src/services/dropship.service.ts — getBalance, getTransactions (paginated + date/type filter), getRecentTransactions, submitTopUp, confirmTopUp (admin), getBalanceHistory (daily aggregates for chart), getStatement, checkThreshold
- server/src/services/support.service.ts — getTickets (user's own), getTicketById (with messages, exclude internal notes for partners), createTicket, addMessage, closeTicket
- server/src/validators/commerce.validators.ts — Zod: createOrderSchema, topUpSchema, createTicketSchema, ticketMessageSchema, quoteRequestSchema
- server/src/routes/orders.ts — All require authenticate + requireApproved. GET /, GET /:id, POST /, POST /:id/cancel, POST /:id/reorder
- server/src/routes/invoices.ts — GET /, GET /:id, GET /:id/download
- server/src/routes/tracking.ts — GET /, GET /order/:orderId
- server/src/routes/support.ts — GET /, GET /:id, POST /, POST /:id/messages, POST /:id/close
- server/src/routes/pricing.ts — GET /price-list, GET /moq-rules, GET /bulk-discounts, POST /quote-request, GET /quote-requests
- server/src/routes/dropship.ts — All also require requireAccountType('DROPSHIP'). GET /balance, GET /transactions, GET /transactions/recent, POST /topup, GET /balance-history, GET /statement

MODIFY: server/src/app.ts — mount: /api/orders, /api/invoices, /api/tracking, /api/support, /api/pricing, /api/dropship

CRITICAL: Users must only access their OWN data. Every query must filter by userId. Wholesale users cannot access /api/dropship routes (403).

VERIFY:
- Login as wholesale → GET /api/pricing/price-list → returns visible items
- Login as dropship → GET /api/dropship/balance → returns balance + threshold
- POST /api/orders with valid data → order created + timeline entry
- POST /api/support → ticket created, POST /api/support/:id/messages → message added
- Wholesale on GET /api/dropship/balance → 403
- Accessing another user's order → 404 (not 403)
- cd server && npx tsc --noEmit — 0 errors
```

#### Backend Wave 6 Launch — Parallel (After Wave 5 merge)

| Agent | Task | Worktree Branch | Files Created/Modified |
|-------|------|-----------------|----------------------|
| **Agent J** | Task 23 — Admin API | `task-23-admin-api` | `server/src/routes/admin/*.ts`, `server/src/services/admin.service.ts`, `server/src/services/operations.service.ts`, `server/src/validators/admin.validators.ts` |
| **Agent K** | Task 24 — Uploads & Email | `task-24-uploads-email` | `server/src/services/upload.service.ts`, `server/src/services/email.service.ts`, `server/src/routes/media.ts`, `server/src/templates/*.ts` |

**Merge Strategy**: Agent J creates `server/src/routes/admin/` directory. Agent K creates media route + email templates. Only overlap is `server/src/app.ts` (mount points) and minor wiring in existing services. Merge Agent J first, then Agent K.

```
Launch TWO agents in parallel using isolation: "worktree":

Agent J — Task 23 Admin & Operations API:
Read TASKS.md section "Task 23 — Admin & Operations API" and complete ALL steps.
Start by reading: server/prisma/schema.prisma (all models), server/src/middleware/auth.ts (authenticate, requireAdmin), server/src/services/ (all existing services to understand patterns and extend).

CREATE:
- server/src/services/admin.service.ts — Partners: getApplications(filters), getApplicationById, approveApplication (update app + user status, log activity, "would send email" placeholder), rejectApplication, getPartners(filters), getPartnerById, suspendPartner, reactivatePartner, getPartnerOrders. Pricing: getPricingRules, savePricingRules, MOQ CRUD, BulkDiscountTier CRUD. Vendors: full CRUD. Brand: getBrandConfig, updateBrandConfig.
- server/src/services/operations.service.ts — Orders: getOperationalOrders (all orders, not user-filtered), updateOrderStatus (+ OrderTimeline + ActivityLog), assignOrder, addInternalNote, bulkUpdateStatus. Returns: getReturns, getReturnById, createReturn, updateReturnStatus, addReturnNote. Activity: getActivityLog (paginated, filter by type/user/date), exportActivityLogCSV. Admin Support: getAllTickets (cross-partner), assignTicket, addInternalNote, escalatePriority, adminReply, closeTicket, reopenTicket. Stats: getOpsStats (pending fulfilment count, avg fulfilment time, open tickets, orders by status).
- server/src/validators/admin.validators.ts — Zod schemas for all admin inputs (approveSchema, rejectSchema, suspendSchema, pricingRuleSchema, moqRuleSchema, bulkDiscountSchema, vendorSchema, brandConfigSchema, orderStatusSchema, returnSchema, returnStatusSchema, ticketAssignSchema, ticketReplySchema)
- server/src/routes/admin/partners.ts — GET /applications, GET /applications/:id, POST /applications/:id/approve, POST /applications/:id/reject, GET /, GET /:id, POST /:id/suspend, POST /:id/reactivate
- server/src/routes/admin/pricing.ts — GET /rules, PUT /rules, GET /moq, POST /moq, PUT /moq/:id, DELETE /moq/:id, GET /bulk-discounts, POST /bulk-discounts, PUT /bulk-discounts/:id, DELETE /bulk-discounts/:id
- server/src/routes/admin/vendors.ts — GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- server/src/routes/admin/brand.ts — GET /, PUT /
- server/src/routes/admin/operations.ts — GET /stats, GET /orders, PUT /orders/:id/status, PUT /orders/:id/assign, POST /orders/:id/notes, PUT /orders/bulk-status, GET /returns, GET /returns/:id, POST /returns, PUT /returns/:id/status, POST /returns/:id/notes, GET /activity-log, GET /activity-log/export
- server/src/routes/admin/support.ts — GET /, GET /:id, PUT /:id/assign, POST /:id/internal-notes, PUT /:id/priority, POST /:id/reply, POST /:id/close, POST /:id/reopen
- server/src/routes/admin/topups.ts — GET /pending, POST /:id/confirm, POST /:id/reject

MODIFY: server/src/app.ts — mount all under /api/admin/* (partners, pricing, vendors, brand, operations, support, topups)

ALL routes require authenticate + requireAdmin. EVERY status change creates an ActivityLog entry.

VERIFY:
- Admin login → all /api/admin/* endpoints accessible
- Partner login → all /api/admin/* → 403
- POST /api/admin/partners/applications/:id/approve → user.approvalStatus changes to APPROVED + ActivityLog entry
- PUT /api/admin/operations/orders/:id/status → OrderTimeline + ActivityLog entries
- POST /api/admin/topups/:id/confirm → dropship balance increases + Transaction created
- GET /api/admin/operations/activity-log → paginated log entries
- GET /api/admin/operations/activity-log/export → CSV string response
- cd server && npx tsc --noEmit — 0 errors

---

Agent K — Task 24 File Uploads & Email:
Read TASKS.md section "Task 24 — File Uploads & Email" and complete ALL steps.
Start by reading: server/prisma/schema.prisma (MediaItem model), server/src/config/env.ts (UPLOAD_DIR, MAX_FILE_SIZE, SMTP_* vars), server/src/app.ts.

CREATE:
- server/src/services/upload.service.ts — multer config: storage to UPLOAD_DIR, file filter (jpg/png/gif/webp/svg only), size limit from MAX_FILE_SIZE. Exports: uploadSingle(fieldName), uploadMultiple(fieldName, maxCount), processUpload(file) (save + create MediaItem → { id, url, filename, mimeType, size }), deleteUpload(mediaId) (remove file + DB record), getMediaItems(filters) (paginated).
- server/src/services/email.service.ts — nodemailer transport: if SMTP_HOST set → SMTP, else → console log (dev). Functions: sendEmail(to, subject, html), sendWelcomeEmail(user), sendApplicationApproved(user), sendApplicationRejected(user, reason), sendOrderConfirmation(user, order), sendPasswordReset(user, resetUrl), sendTopUpConfirmation(user, amount). All fire-and-forget (don't await, log errors silently).
- server/src/routes/media.ts — GET /api/media (admin, paginated+search), POST /api/media/upload (admin, uploadSingle('file')), POST /api/media/upload-multiple (admin, uploadMultiple('files', 10)), DELETE /api/media/:id (admin), GET /api/media/:id (authenticated)
- server/src/templates/welcome.ts — HTML template function (inline styles, uses brand config)
- server/src/templates/application-approved.ts — approval template with next steps
- server/src/templates/application-rejected.ts — rejection template
- server/src/templates/order-confirmation.ts — order details template
- server/src/templates/password-reset.ts — reset link template
- server/uploads/.gitkeep

MODIFY:
- server/src/app.ts — mount /api/media routes + app.use('/uploads', express.static(env.UPLOAD_DIR))
- server/.gitignore — add: uploads/* and !uploads/.gitkeep
- server/src/services/auth.service.ts — wire sendWelcomeEmail on register, sendPasswordReset on forgot-password
- server/src/services/admin.service.ts — wire sendApplicationApproved/Rejected on approve/reject (if this file exists from Agent J — if not, add TODO comments)

VERIFY:
- POST /api/media/upload with image → file on disk + MediaItem in DB + URL /uploads/filename accessible
- DELETE /api/media/:id → file removed + DB record removed
- POST /api/media/upload with .exe file → 400 "Only image files are allowed"
- POST /api/media/upload with 10MB image → 400 "File too large"
- Register new user → console shows welcome email HTML (dev mode)
- Non-admin → 403 on upload/delete
- cd server && npx tsc --noEmit — 0 errors
```

#### Backend Wave 7 Launch — Integration & QA (Sequential, after Wave 6 merge)

| Agent | Task | Branch |
|-------|------|--------|
| **Agent L** | Task 25 — Frontend-Backend Integration | `task-25-integration` |
| **Agent M** | Task 26 — Backend QA | `task-26-backend-qa` |

**These run sequentially** — Task 25 must complete before Task 26.

```
Agent L — Task 25 Frontend-Backend Integration (run ALONE, not parallel):
Read TASKS.md section "Task 25 — Frontend-Backend Integration" and complete ALL steps.
Start by reading: ALL files in src/services/ (every mock service), src/contexts/AuthContext.tsx, src/contexts/BrandContext.tsx.
Then read: server/src/routes/ (all route files — understand every available API endpoint).

This task REPLACES all frontend mock services with real API calls. Keep the same exported function signatures so page components don't need changes.

CREATE:
- src/lib/api-client.ts — ApiClient class with: getToken() from localStorage, request<T>(endpoint, options) with auto-auth header, get/post/put/delete/upload methods, error handling (throw ApiError on non-ok response, clear token on 401)
- .env.example — VITE_API_URL=http://localhost:4000/api

MODIFY (replace mock internals with api.get/post/put/delete calls):
- src/services/auth.service.ts → /api/auth/login, /api/auth/register, /api/auth/me, /api/auth/forgot-password, /api/auth/reset-password, /api/auth/change-password, /api/auth/logout
- src/services/orders.service.ts → /api/orders (GET list with filters, GET /:id detail)
- src/services/invoices.service.ts → /api/invoices (GET list, GET /:id, GET /:id/download)
- src/services/tracking.service.ts → /api/tracking (GET active, GET /order/:orderId)
- src/services/support.service.ts → /api/support (GET list, GET /:id, POST create, POST /:id/messages, POST /:id/close)
- src/services/pricing.service.ts → /api/pricing (GET /price-list, /moq-rules, /bulk-discounts)
- src/services/ordering.service.ts → POST /api/orders
- src/services/dashboard.service.ts → composite: GET /api/orders + GET /api/support stats
- src/services/account.service.ts → GET /api/auth/me, POST /api/auth/change-password
- src/services/dropship.service.ts → /api/dropship/* (balance, transactions, topup, history, statement)
- src/services/admin.service.ts → /api/categories, /api/products, /api/pages, /api/faq, /api/media
- src/services/partners.service.ts → /api/admin/partners/*
- src/services/pricing-admin.service.ts → /api/admin/pricing/*
- src/services/vendors.service.ts → /api/admin/vendors/*
- src/services/operations.service.ts → /api/admin/operations/*
- src/contexts/AuthContext.tsx — on mount: if token in localStorage → getCurrentUser() → set state. login/register: store token, set user. 401 errors: clear token + redirect to login.
- src/contexts/BrandContext.tsx — fetch brand config from API on mount
- vite.config.ts — add server.proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } }

CRITICAL: Keep exported function signatures identical. Only change the implementation inside each function. Every service call should have try/catch. On 401 → clear auth. Pages should already have loading/error states from frontend tasks.

VERIFY (run BOTH servers):
- Terminal 1: cd server && npm run dev
- Terminal 2: npm run dev
- Register → see pending page
- Login as wholesale@test.com/test123 → dashboard loads data from API
- Navigate orders → order list from DB → click order → detail from DB
- Login as dropship user → dropship dashboard → balance from API → top up flow
- Login as admin@test.com/admin123 → CMS → edit category → save → refreshes from DB
- Admin: approve pending application → partner can now login
- No mock data visible anywhere — ALL data from API
- npm run build — 0 errors (frontend)
- cd server && npx tsc --noEmit — 0 errors (backend)
```

```
Agent M — Task 26 Backend QA & Deployment (run AFTER Task 25 is merged):
Read TASKS.md section "Task 26 — Backend QA & Deployment" and complete ALL steps.
Start by reading: server/src/ (entire backend codebase), server/prisma/schema.prisma.

This is a comprehensive security audit + deployment prep:

1. SECURITY — Add packages + middleware:
   - npm install express-rate-limit helmet
   - Add helmet() middleware in app.ts (after cors, before routes)
   - Add rate limiting: /api/auth/login → 5 per 15 min per IP, /api/auth/register → 3 per hour, /api/auth/forgot-password → 3 per hour, global → 100 per minute
   - AUDIT: grep all route files for POST/PUT handlers without validate() middleware — add Zod validation to any unprotected route
   - AUDIT: grep for "passwordHash" in API responses — must NEVER be returned
   - AUDIT: verify every partner/commerce query filters by userId (no IDOR)
   - AUDIT: verify CORS only allows FRONTEND_URL

2. EDGE CASES — Test + fix each:
   - Create order with nonexistent product → 400 "Product not found"
   - Dropship order when balance locked → 400 "Account balance is locked"
   - Delete category that has products → 400 "Cannot delete category with products"
   - Register with existing email → 409 "Email already registered"
   - GET /api/orders/:otherId (another user's order) → 404 (NOT 403)
   - Upload file >MAX_FILE_SIZE → 400 with size message
   - Upload .exe file → 400 "Only image files are allowed"

3. DATABASE INDEXES — Add to schema.prisma:
   - Order: @@index([userId, status]), @@index([status, createdAt])
   - Transaction: @@index([userId, createdAt])
   - ProductFamily: @@index([categoryId, status])
   - PartnerApplication: @@index([status, createdAt])
   - ActivityLog: @@index([actionType, createdAt]), @@index([userId])
   - SupportTicket: @@index([userId, status])
   - Run: npx prisma migrate dev --name add-indexes

4. API DOCS — Create server/docs/api-reference.md:
   - Every endpoint: method, path, auth, request body, response shape, error codes
   - Group by domain: Auth, Catalog, Commerce, Dropship, Support, Pricing, Admin
   - Include curl examples for key flows

5. DEPLOYMENT — Create server/docs/deployment.md + server/Dockerfile:
   - Multi-stage Docker build (node:20-alpine)
   - docker-compose.yml with api service
   - Environment variables table
   - Database migration + seed commands

VERIFY:
- cd server && npx tsc --noEmit — 0 errors
- npm test — passes
- npm run build — succeeds
- docker compose up — PostgreSQL + API both start
- curl /api/health → { status: "ok" }
- Full login flow works end-to-end
- Rate limiting blocks 6th login attempt within 15 min
- All docs files exist and are comprehensive
```

### Single-Agent Alternative

If running one task at a time (no parallel agents), execute in this order:

**Frontend:**
1. Task 14 → 2. Task 15 → 3. Task 16 → 4. Task 17 → 5. Task 18

**Backend (can start after Task 19 is done):**
6. Task 19 → 7. Task 20 → 8. Task 21 → 9. Task 22 → 10. Task 23 → 11. Task 24 → 12. Task 25 → 13. Task 26

Frontend and backend sequences can run **concurrently** since they work in different directories (`src/` vs `server/`).

### Merge Conflict Hotspots

**Frontend conflicts** (when merging worktree branches):

| File | Modified By | Resolution |
|------|-------------|------------|
| `src/app/routes.tsx` | Tasks 14, 15, 16, 17 | Combine all route additions — each task adds to different route groups |
| `src/layouts/PortalLayout.tsx` | Task 14 | Only Task 14 modifies this (adds dropship sidebar items) |
| `src/layouts/AdminLayout.tsx` | Tasks 15, 17 | Task 15 creates it, Task 17 may update Operations section links |
| `src/types/commerce.ts` | Tasks 14, 16 | Task 14 adds dropship types, Task 16 adds pricing types — both are additive |
| `src/app/App.tsx` | Task 16 | Only Task 16 modifies this (adds BrandProvider wrapper) |

**Backend conflicts:**

| File | Modified By | Resolution |
|------|-------------|------------|
| `server/src/app.ts` | Tasks 20, 21, 22, 23, 24 | Combine all route mounts — each adds different `/api/*` prefixes |
| `server/prisma/schema.prisma` | Tasks 20, 21, 22, 23 | Combine all model definitions — each adds different tables |
| `server/package.json` | Tasks 20, 24 | Merge dependency additions |

**Integration conflicts (Task 25):**

| File | Modified By | Resolution |
|------|-------------|------------|
| `src/services/*.ts` | Task 25 | Replaces mock implementations with API calls — one file at a time |
| `.env` / `.env.example` | Tasks 19, 24, 25 | Combine all env vars |
| `src/app/components/Header.tsx` | Task 16 | Only Task 16 modifies this (wires useBrand()) |
| `src/app/components/Footer.tsx` | Task 16 | Only Task 16 modifies this (wires useBrand()) |

### Sub-Agent Strategy Within Tasks

For large tasks (especially 15, 17, 18), Claude Code can spawn sub-agents to parallelize internal work:

**Task 15 Internal Parallelism:**
- Sub-agent 1: AdminLayout + admin.service.ts + Category CMS pages
- Sub-agent 2: Product CMS pages + Pages CMS pages
- Sub-agent 3: FAQ management + Media library
- Merge: main agent registers all routes

**Task 17 Internal Parallelism:**
- Sub-agent 1: operations.service.ts + Order Workflow Board
- Sub-agent 2: Ops Dashboard + Activity Log
- Sub-agent 3: Returns management + Admin Support view
- Merge: main agent registers all routes

**Task 18 Internal Parallelism:**
- Sub-agent 1: Visual consistency audit (all public pages)
- Sub-agent 2: Link & route audit + auth redirect testing
- Sub-agent 3: Code quality audit (grep for console.log, any types, unused imports, component sizes)
- Merge: main agent runs final build check

**Task 19 Internal Parallelism (Backend Foundation):**
- Sub-agent 1: package.json + tsconfig + docker-compose + nodemon + .env.example + .gitignore
- Sub-agent 2: prisma/schema.prisma (complete schema — 25+ models, all enums, all relations)
- Sub-agent 3: src/config/ + src/middleware/ + src/utils/ + src/types/ + src/app.ts + src/server.ts
- Sub-agent 4: prisma/seed.ts (seed data — depends on schema being done)
- Merge: main agent runs npm install + prisma generate + tsc --noEmit

**Task 22 Internal Parallelism (Commerce API — largest backend task):**
- Sub-agent 1: commerce.service.ts + commerce.validators.ts + orders.ts + invoices.ts + tracking.ts routes
- Sub-agent 2: dropship.service.ts + dropship.ts route
- Sub-agent 3: support.service.ts + support.ts route + pricing.ts route
- Merge: main agent mounts all routes in app.ts + runs tsc --noEmit

**Task 23 Internal Parallelism (Admin API — second largest):**
- Sub-agent 1: admin.service.ts (partners + pricing + vendors + brand) + admin/partners.ts + admin/pricing.ts + admin/vendors.ts + admin/brand.ts routes
- Sub-agent 2: operations.service.ts (orders + returns + activity log + stats) + admin/operations.ts route
- Sub-agent 3: operations.service.ts (admin support) + admin/support.ts + admin/topups.ts routes
- Merge: main agent mounts all routes + runs tsc --noEmit

**Task 25 Internal Parallelism (Integration — many files, all independent):**
- Sub-agent 1: api-client.ts + auth.service.ts + AuthContext.tsx + account.service.ts
- Sub-agent 2: orders.service.ts + ordering.service.ts + invoices.service.ts + tracking.service.ts + dashboard.service.ts
- Sub-agent 3: support.service.ts + pricing.service.ts + dropship.service.ts
- Sub-agent 4: admin.service.ts + partners.service.ts + pricing-admin.service.ts + vendors.service.ts + operations.service.ts + BrandContext.tsx
- Merge: main agent updates vite.config.ts proxy + runs build on both frontend and backend

---

## Current Project State

### Completed (Tasks 1–13)
- Baseline audit done
- Reusable `CategoryPage.tsx` and `ProductPage.tsx` templates created
- All 5 category content entries populated in `categories.ts`
- All 16 product family entries populated in `product-families.ts`
- Static info pages built (About, How It Works, FAQ, Privacy, Terms, Shipping, Returns, Contact)
- Auth foundation (AuthContext, AuthGuard, auth.service.ts, types)
- Auth UI pages (Login, Register, Apply, Forgot/Reset Password, Pending, Restricted)
- Portal layout + Dashboard
- Portal: Orders (list + detail)
- Portal: Invoices & Tracking
- Portal: Support (tickets list, new ticket, ticket detail)
- Portal: Account Settings
- Wholesale pricing, ordering, quote flows

### Remaining — Frontend
- **Task 14**: Dropship balance & ledger flows
- **Task 15**: Admin layout & Content CMS
- **Task 16**: Admin management (partners, pricing, vendors, whitelabel)
- **Task 17**: Operations & internal management
- **Task 18**: Final QA & production readiness

### Remaining — Backend
- **Task 19**: Backend foundation & database (Express + Prisma + PostgreSQL setup)
- **Task 20**: Auth API & JWT (register, login, middleware, token management)
- **Task 21**: Content & catalog API (categories, products, pages, FAQ CRUD)
- **Task 22**: Partner & commerce API (orders, invoices, tracking, support, pricing, dropship)
- **Task 23**: Admin & operations API (partner mgmt, pricing rules, vendors, brand, order workflow, returns, activity log)
- **Task 24**: File uploads & email (multer, media library, nodemailer, email templates)
- **Task 25**: Frontend-backend integration (replace ALL mock services with API calls)
- **Task 26**: Backend QA & deployment (security audit, rate limiting, indexes, docs, Docker)

---

## Architecture Reference

```
src/
├── app/
│   ├── App.tsx                    — Root: AuthProvider + RouterProvider
│   ├── routes.tsx                 — All route definitions
│   ├── components/                — Shared + UI components
│   │   ├── guards/AuthGuard.tsx   — Route protection (supports requireAdmin)
│   │   ├── guards/WholesaleGuard.tsx — Wholesale-only route guard
│   │   └── ui/                    — 50+ shadcn/ui primitives
│   └── pages/                     — All page components
│       └── portal/                — Protected partner pages (11 pages)
├── content/                       — Structured TS data (NOT JSX)
│   ├── categories.ts              — Category definitions (40KB, all 5 categories)
│   ├── product-families.ts        — Product family definitions (85KB, all 16 families)
│   ├── navigation.ts              — Nav structure
│   └── site-content.ts            — Homepage, messaging, about
├── contexts/AuthContext.tsx        — Auth state + useAuth() hook
├── layouts/PortalLayout.tsx       — Partner portal shell with sidebar
├── lib/
│   ├── content-types.ts           — TS interfaces for content data
│   └── content-helpers.ts         — Slug lookups, filters
├── services/                      — Mock API layer (9 services)
│   ├── auth.service.ts, account.service.ts, dashboard.service.ts
│   ├── orders.service.ts, ordering.service.ts, invoices.service.ts
│   ├── pricing.service.ts, support.service.ts, tracking.service.ts
├── types/                         — auth.ts, commerce.ts, orders.ts, support.ts
└── styles/                        — index.css, fonts.css, tailwind.css, theme.css
```

### Key Patterns to Follow
- **Routing**: `react-router` v7, slug-based dynamic routes in `src/app/routes.tsx`
- **State**: React Context (AuthContext), local component state
- **Forms**: `react-hook-form` with validation
- **UI Kit**: shadcn/ui components in `src/app/components/ui/` — always use these (Button, Card, Table, Tabs, Badge, Dialog, Sheet, Select, Input, Textarea, etc.)
- **Icons**: `lucide-react`
- **Toast**: `sonner` — use `toast.success()`, `toast.error()`
- **Charts**: `recharts` — for dashboard charts
- **Drag & Drop**: `react-dnd` — for kanban boards, reordering
- **Guards**: Wrap protected routes with `AuthGuard` or custom guards
- **Services**: Mock service pattern — typed interfaces, mock data, async functions returning promises. Easy to swap for real API calls later

---

## Task 14 — Dropship Balance & Ledger

**Goal**: Build the dropship-specific balance, ledger, top-up, and threshold lock flows. Only visible to dropship account type partners.

**Depends on**: Tasks 6–8 (auth + portal layout) — already complete
**Parallel with**: Task 15 (no shared files except routes.tsx)

### Files to Read First
```
src/types/commerce.ts
src/services/orders.service.ts          — study service pattern
src/layouts/PortalLayout.tsx            — sidebar structure
src/contexts/AuthContext.tsx             — account type checking
src/app/components/guards/WholesaleGuard.tsx — guard pattern to mirror
src/app/routes.tsx                      — route registration pattern
```

### Files to Create
```
src/services/dropship.service.ts
src/app/components/guards/DropshipGuard.tsx
src/app/pages/portal/DropshipDashboardPage.tsx
src/app/pages/portal/DropshipLedgerPage.tsx
src/app/pages/portal/TopUpPage.tsx
src/app/pages/portal/BankTransferConfirmPage.tsx
src/app/pages/portal/DropshipStatementPage.tsx
src/app/components/LowBalanceBanner.tsx     (optional — can be inline in PortalLayout)
```

### Files to Modify
```
src/types/commerce.ts                   — add dropship types
src/layouts/PortalLayout.tsx            — add dropship sidebar section
src/app/routes.tsx                      — register dropship routes
```

### Step-by-Step Instructions

#### 14.1 — Types & Service Layer

1. Open `src/types/commerce.ts` and add these types (do NOT duplicate if similar types exist — extend instead):

```typescript
interface DropshipBalance {
  currentBalance: number;
  currency: string;
  threshold: number;
  isLocked: boolean;
  lastUpdated: string; // ISO date
}

interface Transaction {
  id: string;
  date: string; // ISO date
  type: 'top-up' | 'order' | 'refund' | 'adjustment';
  reference: string;
  description: string;
  amount: number; // positive = credit, negative = debit
  runningBalance: number;
}

interface TopUpRequest {
  amount: number;
  method: 'bank-transfer' | 'card';
  reference?: string;
}

interface BalanceThreshold {
  warningLevel: number;
  lockLevel: number;
  currency: string;
}
```

2. Create `src/services/dropship.service.ts`:
   - Export typed functions: `getBalance()`, `getTransactions(filters)`, `getRecentTransactions(limit)`, `submitTopUp(request)`, `getBalanceThreshold()`, `getBalanceHistory(days)`
   - Provide realistic mock data: balance around £450, threshold warning at £100, lock at £50, 15-20 transactions spanning last 60 days with mixed types (top-ups, orders, refunds)
   - Follow the exact same pattern as `orders.service.ts` — read it first
   - All functions return Promises (async-ready)

#### 14.2 — Dropship Guard

3. Create `src/app/components/guards/DropshipGuard.tsx`:
   - Read `WholesaleGuard.tsx` first and mirror the exact pattern
   - Check `user.accountType === 'DROPSHIP'` from `useAuth()`
   - If not dropship → redirect to `/dashboard`
   - Render children if dropship

#### 14.3 — Portal Sidebar Update

4. Open `src/layouts/PortalLayout.tsx`:
   - Add a "Balance & Ledger" section in the sidebar, visible ONLY when `user.accountType === 'DROPSHIP'`
   - Sidebar items:
     - Dropship Dashboard → `/dashboard/dropship`
     - Transaction Ledger → `/dashboard/dropship/ledger`
     - Top Up Funds → `/dashboard/dropship/topup`
     - Statement → `/dashboard/dropship/statement`
   - Use the same sidebar item styling as existing items
   - Use appropriate lucide-react icons (Wallet, FileText, PlusCircle, Download)

#### 14.4 — Dropship Dashboard Page

5. Create `src/app/pages/portal/DropshipDashboardPage.tsx`:
   - **Current balance card**: large, prominent display with currency symbol
     - Green background/text if balance > warning level
     - Amber/yellow if between warning and lock level
     - Red if below lock level (locked)
   - **Low balance warning banner**: shown if below warning level — amber Alert with "Top Up Now" Button
   - **Lock banner**: shown if below lock level — red Alert: "Your balance is below the minimum threshold. Orders are blocked until you top up."
   - **Recent transactions**: last 10 in a Table (Date, Type Badge, Reference, Amount with +green/-red coloring, Running Balance)
   - **Quick top-up button**: primary Button linking to `/dashboard/dropship/topup`
   - **Balance trend**: mini line chart using `recharts` (LineChart, Line, XAxis, YAxis, Tooltip) showing balance over last 30 days from `getBalanceHistory(30)`
   - Use shadcn `Card` for each section, `Badge` for transaction types, `Button` for actions

6. Route: `/dashboard/dropship` → wrapped in `DropshipGuard`

#### 14.5 — Transaction Ledger Page

7. Create `src/app/pages/portal/DropshipLedgerPage.tsx`:
   - **Full transaction table**: columns — Date, Type (Badge), Reference, Description, Amount (+green/-red), Running Balance
   - **Filters row**: date range (two date inputs or Calendar+Popover), transaction type Select dropdown
   - **Pagination** at bottom
   - **Download statement** Button: triggers mock action, shows `toast.success("Statement download started")`
   - **Empty state**: if no transactions match filters — "No transactions found" with reset filters link

8. Route: `/dashboard/dropship/ledger` → wrapped in `DropshipGuard`

#### 14.6 — Top-Up Page

9. Create `src/app/pages/portal/TopUpPage.tsx`:
   - **Current balance display** at top (Card with balance and status color)
   - **Amount selection section**:
     - Preset amount buttons: £100, £250, £500, £1000 (click to select, highlighted when active)
     - Custom amount Input below with "or enter custom amount" label
   - **Payment method** using shadcn `Tabs`:
     - "Bank Transfer" tab: show bank details in a highlighted Card (Sort Code: 12-34-56, Account: 12345678, Reference format: "HOMATZ-{accountId}-{timestamp}")
     - "Card Payment" tab: message "Card payments coming soon. Please use bank transfer for now."
   - **Submit** Button: validates amount > 0, opens confirmation Dialog ("Confirm top-up of £X via Bank Transfer?"), on confirm → navigate to `/dashboard/dropship/topup/bank-confirm?amount=X`
   - Use `react-hook-form` for the form

10. Route: `/dashboard/dropship/topup` → wrapped in `DropshipGuard`

#### 14.7 — Bank Transfer Confirmation Page

11. Create `src/app/pages/portal/BankTransferConfirmPage.tsx`:
    - **Confirmation Card**: reference number (generated mock UUID), amount (from URL params), date
    - **Bank details repeated**: sort code, account number, reference — in a prominent Card
    - **Upload proof of payment**: file Input (visual only — disabled with message "Upload will be available once connected to backend")
    - **Submit confirmation** Button: shows `toast.success("Confirmation submitted. Balance will be updated within 24 hours.")`, redirects to `/dashboard/dropship`
    - **"What happens next"** section: ordered list — 1. Make bank transfer, 2. We verify payment, 3. Balance updated within 24h

12. Route: `/dashboard/dropship/topup/bank-confirm` → wrapped in `DropshipGuard`

#### 14.8 — Statement Page

13. Create `src/app/pages/portal/DropshipStatementPage.tsx`:
    - **Date range picker**: Start and End date inputs (or Calendar+Popover)
    - **Preview section**: after selecting dates, show summary Card — transaction count, total credits, total debits, net change
    - **Generate** Button: mock PDF generation, shows `toast.success("Statement generated")`
    - **Download** Button: appears after generate, mock download action

14. Route: `/dashboard/dropship/statement` → wrapped in `DropshipGuard`

#### 14.9 — Low Balance Lock Behavior

15. Create `src/app/components/LowBalanceBanner.tsx` (or add inline to `PortalLayout.tsx`):
    - If user is dropship AND balance < lock level: persistent **red** banner at top of all portal pages:
      > "Your balance is below the minimum threshold (£50). Please top up to continue placing orders."
      > [Top Up Now] button
    - If user is dropship AND balance < warning level but above lock: persistent **amber** banner:
      > "Your balance is running low. Top up to avoid service interruption."
      > [Top Up Now] button
    - Banner renders inside `PortalLayout` above the main content area, below the top bar
    - Fetch balance from `dropship.service.getBalance()` on mount (or use a simple context/state)

16. In any order submission page (if dropship user accesses it): if balance is locked, disable submit Button and show inline Alert: "Insufficient balance. Please top up before placing orders." with link to `/dashboard/dropship/topup`

#### 14.10 — Route Registration & Verification

17. Open `src/app/routes.tsx` and add all new routes:
    ```
    /dashboard/dropship           → DropshipDashboardPage   (DropshipGuard)
    /dashboard/dropship/ledger    → DropshipLedgerPage      (DropshipGuard)
    /dashboard/dropship/topup     → TopUpPage               (DropshipGuard)
    /dashboard/dropship/topup/bank-confirm → BankTransferConfirmPage (DropshipGuard)
    /dashboard/dropship/statement → DropshipStatementPage   (DropshipGuard)
    ```

18. **Verification checklist:**
    - [ ] Login as mock wholesale user → dropship sidebar items NOT visible
    - [ ] Login as mock dropship user → all dropship sidebar items visible
    - [ ] All 5 dropship pages render without errors
    - [ ] Balance colors change based on threshold levels
    - [ ] Top-up flow: select amount → confirm → bank details → confirmation
    - [ ] Ledger filters work, pagination works
    - [ ] Low balance banner appears when mock balance is below threshold
    - [ ] `npm run build` — 0 errors
    - [ ] `npx tsc --noEmit` — 0 type errors

---

## Task 15 — Admin Layout & Content CMS

**Goal**: Build the admin panel shell and full content management screens for categories, products, pages, FAQ, and media.

**Depends on**: Task 6 (auth foundation) — already complete
**Parallel with**: Task 14 (different file domains)

### Files to Read First
```
src/layouts/PortalLayout.tsx            — layout pattern reference
src/app/components/guards/AuthGuard.tsx — requireAdmin prop
src/types/auth.ts                       — admin role type
src/lib/content-types.ts                — data shapes CMS forms must produce
src/content/categories.ts               — category data structure
src/content/product-families.ts         — product data structure
src/app/routes.tsx                      — route patterns
```

### Files to Create
```
src/layouts/AdminLayout.tsx
src/services/admin.service.ts
src/app/pages/admin/CategoryListPage.tsx
src/app/pages/admin/CategoryEditPage.tsx
src/app/pages/admin/ProductListPage.tsx
src/app/pages/admin/ProductEditPage.tsx
src/app/pages/admin/PagesListPage.tsx
src/app/pages/admin/PageEditPage.tsx
src/app/pages/admin/FAQManagementPage.tsx
src/app/pages/admin/MediaLibraryPage.tsx
```

### Files to Modify
```
src/app/routes.tsx                      — register admin routes
```

### Internal Sub-Agent Strategy

This task has many independent pages. Split across sub-agents:

| Sub-Agent | Scope | Files |
|-----------|-------|-------|
| **15-A** | AdminLayout + admin.service.ts + Category CMS | AdminLayout.tsx, admin.service.ts, CategoryListPage.tsx, CategoryEditPage.tsx |
| **15-B** | Product CMS + Pages CMS | ProductListPage.tsx, ProductEditPage.tsx, PagesListPage.tsx, PageEditPage.tsx |
| **15-C** | FAQ + Media Library | FAQManagementPage.tsx, MediaLibraryPage.tsx |
| **Main** | Route registration + verification | routes.tsx |

Sub-agents 15-B and 15-C depend on admin.service.ts from 15-A. Run 15-A first, then 15-B and 15-C in parallel.

### Step-by-Step Instructions

#### 15.1 — Admin Layout

1. Create `src/layouts/AdminLayout.tsx`:
   - **Sidebar navigation** (collapsible on mobile via shadcn `Sheet`):
     - **Content** (FolderOpen icon): Categories, Products, Pages, FAQ, Media
     - **Partners** (Users icon): Applications, Partner List, Roles & Permissions
     - **Commerce** (ShoppingCart icon): Pricing Rules, Vendors
     - **Platform** (Settings icon): Brand Settings
     - **Operations** (BarChart3 icon): Orders, Dashboard, Returns, Activity Log, Support
   - Each section has a header that collapses/expands with ChevronDown/ChevronRight
   - Active nav item highlighted based on current route (use `useLocation()`)
   - **Top bar**: admin user name, "Admin" Badge, "View Public Site" link (→ `/` in new tab), Logout Button
   - **Main content area**: Breadcrumbs component + `{children}` or `<Outlet />`
   - **Mobile**: sidebar hidden by default, hamburger Button opens Sheet overlay
   - **Min width sidebar**: ~240px on desktop, full-width Sheet on mobile

2. All `/admin/*` routes wrapped with `AuthGuard` using `requireAdmin={true}`.

#### 15.2 — Admin Service

3. Create `src/services/admin.service.ts`:
   - Import types from `src/lib/content-types.ts`
   - **Category operations**: `getCategories()`, `getCategoryBySlug(slug)`, `saveCategory(data)`, `deleteCategory(slug)`
   - **Product operations**: `getProducts(categoryFilter?)`, `getProductBySlug(slug)`, `saveProduct(data)`, `deleteProduct(slug)`
   - **Page operations**: `getPages()`, `getPageBySlug(slug)`, `savePage(data)`, `deletePage(slug)`
   - **FAQ operations**: `getFAQItems()`, `saveFAQItem(data)`, `deleteFAQItem(id)`, `reorderFAQItems(ids)`
   - **Media operations**: `getMediaItems()`, `uploadMedia(file)`, `deleteMedia(id)`
   - Mock in-memory store initialized from `categories.ts` and `product-families.ts` data
   - All functions return `Promise<T>` — async ready
   - Use realistic delay: `await new Promise(r => setTimeout(r, 300))`

#### 15.3 — Category CMS

4. Create `src/app/pages/admin/CategoryListPage.tsx`:
   - **Table** (shadcn Table): Name, Slug, Subcategory Count, Product Count, Last Updated
   - **Search** Input above table to filter by name
   - **Add Category** Button → navigates to `/admin/categories/new/edit`
   - **Row actions** (shadcn DropdownMenu): Edit (→ edit page), View on Site (→ `/category/:slug` new tab), Delete (→ confirmation Dialog)
   - **Loading state**: Skeleton rows while fetching
   - **Empty state**: "No categories yet. Create your first category."

5. Create `src/app/pages/admin/CategoryEditPage.tsx`:
   - Use `react-hook-form` with `useFieldArray` for dynamic lists
   - **Form sections** (use shadcn `Tabs`: Basic, Content, Products, SEO):
     - **Basic tab**: Name (Input), Slug (auto-gen from name, editable Input), Status (Switch for published/draft)
     - **Content tab**:
       - Hero: Title (Input), Description (Textarea), Hero Image URL (Input + ImageWithFallback preview)
       - Intro: Intro text (Textarea)
       - Subcategories: sortable list via `react-dnd` — each row: name, slug, image URL, description. Add/Remove Buttons
       - Benefits: list — icon name (Input), title (Input), description (Input). Add/Remove
       - CTA Strip: headline (Input), description (Textarea), button text (Input), button link (Input)
       - Related Categories: multi-select from other categories (Popover + Command for searchable multi-select)
     - **Products tab**: Featured Families multi-select from products in this category
     - **SEO tab**: Meta title (Input), Meta description (Textarea)
   - **Sticky actions bar** at bottom: Save Draft Button, Publish Button (primary), Preview Button (opens `/category/:slug`), Cancel Button (back to list)
   - On save → `admin.service.saveCategory()` → `toast.success("Category saved")` → stay on page
   - If editing existing: load data via `getCategoryBySlug(slug)` from URL param
   - If new: empty form

6. Routes:
   - `/admin/categories` → CategoryListPage
   - `/admin/categories/new/edit` → CategoryEditPage
   - `/admin/categories/:slug/edit` → CategoryEditPage

#### 15.4 — Product Family CMS

7. Create `src/app/pages/admin/ProductListPage.tsx`:
   - **Table**: Name, Category (Badge), Variants Count, Last Updated
   - **Category filter**: Select dropdown above table
   - **Search**: Input to filter by name
   - **Add Product** Button → `/admin/products/new/edit`
   - **Row actions**: Edit, View on Site, Delete (with confirmation Dialog)

8. Create `src/app/pages/admin/ProductEditPage.tsx`:
   - **Tabbed form** (shadcn Tabs: Basic, Content, Gallery, Specs, Variants, Related, SEO):
     - **Basic**: Name, Slug, Category (Select dropdown), Status (Switch)
     - **Content**:
       - Summary (Textarea)
       - Features list (useFieldArray — add/remove items, each is a text Input)
       - Use Cases list (useFieldArray — add/remove, each is text Input)
       - Long Description (large Textarea)
     - **Gallery**: Image URLs list — add Input + preview row. Remove Button per row. Drag to reorder with `react-dnd`
     - **Specs**: Dynamic key-value Table. Each row: Spec Name (Input), Spec Value (Input). Add Row / Remove Row Buttons
     - **Variants**: useFieldArray — each variant: Name (Input), SKU (Input), Key Specs (nested dynamic list), Image URL (Input + preview). Add/Remove/Reorder
     - **Related**: Related Products multi-select (Popover+Command), Related Categories multi-select
     - **SEO**: Meta Title, Meta Description
   - **Sticky actions**: Save Draft, Publish, Preview, Cancel
   - Data loaded from `getProductBySlug()` or empty for new

9. Routes:
   - `/admin/products` → ProductListPage
   - `/admin/products/new/edit` → ProductEditPage
   - `/admin/products/:slug/edit` → ProductEditPage

#### 15.5 — Pages CMS

10. Create `src/app/pages/admin/PagesListPage.tsx`:
    - **Table**: Title, Slug, Status Badge (Published green / Draft grey), Last Updated
    - **Add Page** Button
    - **Row actions**: Edit, View (`/:slug`), Delete

11. Create `src/app/pages/admin/PageEditPage.tsx`:
    - **Form**: Title (Input), Slug (Input), Body (large Textarea — plain text or markdown, no WYSIWYG needed), Status Switch (Published/Draft), Meta Title (Input), Meta Description (Textarea)
    - **Actions**: Save, Preview, Delete (with confirmation), Cancel

12. Routes:
    - `/admin/pages` → PagesListPage
    - `/admin/pages/new/edit` → PageEditPage
    - `/admin/pages/:slug/edit` → PageEditPage

#### 15.6 — FAQ CMS

13. Create `src/app/pages/admin/FAQManagementPage.tsx`:
    - **Category tabs** at top (General, Wholesale, Dropship, Shipping, Returns)
    - **FAQ items list** per category: accordion-style — question as header, answer preview truncated
    - **Drag handles** for reorder within category (use `react-dnd`)
    - **Add FAQ** Button → Dialog with: question (Input), answer (Textarea), category (Select)
    - **Edit**: click item → inline expand or Dialog with pre-filled fields
    - **Delete**: Button with confirmation Dialog
    - Single page, no sub-routes

14. Route: `/admin/faq` → FAQManagementPage

#### 15.7 — Media Library

15. Create `src/app/pages/admin/MediaLibraryPage.tsx`:
    - **View toggle**: Grid / List (using Tabs or toggle Buttons)
    - **Grid view**: image thumbnail cards (aspect-ratio preserved), filename below, hover overlay with actions
    - **List view**: Table — thumbnail, filename, dimensions, upload date, actions
    - **Upload** Button: file Input (UI only — on "upload" show `toast.success("Uploaded successfully")`)
    - **Search** Input: filter by filename
    - **Item actions**: Copy URL (copies to clipboard, `toast.success("URL copied")`), Delete (confirmation Dialog)

16. Route: `/admin/media` → MediaLibraryPage

#### 15.8 — Route Registration

17. Open `src/app/routes.tsx` and register all admin routes under `/admin` parent:
    - Layout: `AdminLayout`
    - Guard: `AuthGuard` with `requireAdmin={true}`
    - Default `/admin` redirects to `/admin/categories`
    ```
    /admin/categories                → CategoryListPage
    /admin/categories/new/edit       → CategoryEditPage
    /admin/categories/:slug/edit     → CategoryEditPage
    /admin/products                  → ProductListPage
    /admin/products/new/edit         → ProductEditPage
    /admin/products/:slug/edit       → ProductEditPage
    /admin/pages                     → PagesListPage
    /admin/pages/new/edit            → PageEditPage
    /admin/pages/:slug/edit          → PageEditPage
    /admin/faq                       → FAQManagementPage
    /admin/media                     → MediaLibraryPage
    ```

18. **Verification checklist:**
    - [ ] Login as admin → admin sidebar renders with all sections
    - [ ] Login as partner → `/admin/*` routes redirect or show forbidden
    - [ ] Category list loads all 5 existing categories
    - [ ] Category edit form loads Kitchen & Household data correctly
    - [ ] Product list loads all 16 product families
    - [ ] Product edit form loads Stock Pot data correctly
    - [ ] All form submissions work (save to mock service, show toast)
    - [ ] FAQ drag-reorder works
    - [ ] Media library grid/list toggle works
    - [ ] Mobile: sidebar collapses to Sheet overlay
    - [ ] `npm run build` — 0 errors
    - [ ] `npx tsc --noEmit` — 0 type errors

---

## Task 16 — Admin: Partners, Pricing, Vendors, Whitelabel

**Goal**: Build partner approval, pricing rules, vendor management, and whitelabel brand configuration.

**Depends on**: Task 15 (admin layout exists)
**Parallel with**: Task 17 (different page domains, share AdminLayout)

### Files to Read First
```
src/layouts/AdminLayout.tsx             — admin layout structure
src/services/admin.service.ts           — service pattern
src/types/auth.ts                       — User, ApprovalStatus types
src/types/commerce.ts                   — pricing types
src/contexts/AuthContext.tsx             — auth pattern for BrandContext reference
src/app/App.tsx                         — where to add BrandProvider
src/app/components/Header.tsx           — wire useBrand()
src/app/components/Footer.tsx           — wire useBrand()
src/app/routes.tsx                      — route registration
```

### Files to Create
```
src/services/partners.service.ts
src/services/pricing-admin.service.ts
src/services/vendors.service.ts
src/contexts/BrandContext.tsx
src/app/pages/admin/PartnerApplicationsPage.tsx
src/app/pages/admin/PartnerListPage.tsx
src/app/pages/admin/RolesPermissionsPage.tsx
src/app/pages/admin/PricingAdminPage.tsx
src/app/pages/admin/VendorsPage.tsx
src/app/pages/admin/BrandSettingsPage.tsx
```

### Files to Modify
```
src/app/App.tsx                         — add BrandProvider
src/app/components/Header.tsx           — use useBrand()
src/app/components/Footer.tsx           — use useBrand()
src/app/routes.tsx                      — register routes
```

### Internal Sub-Agent Strategy

| Sub-Agent | Scope |
|-----------|-------|
| **16-A** | Partner services + Partner pages (Applications, List, Roles) |
| **16-B** | Pricing service + Pricing page + Vendor service + Vendor page |
| **16-C** | BrandContext + Brand settings page + Header/Footer wiring |
| **Main** | Route registration + verification |

16-A and 16-B can run in parallel. 16-C can also run in parallel if it doesn't touch routes.tsx.

### Step-by-Step Instructions

#### 16.1 — Partner Management Service

1. Create `src/services/partners.service.ts`:
   - Types (define at top of file or in a separate types file):
     ```typescript
     interface PartnerApplication {
       id: string;
       companyName: string;
       accountType: 'WHOLESALE' | 'DROPSHIP';
       status: 'PENDING' | 'APPROVED' | 'REJECTED';
       dateApplied: string;
       contactName: string;
       contactEmail: string;
       contactPhone: string;
       companyRegNumber: string;
       address: { line1: string; line2?: string; city: string; postcode: string; country: string };
       // Wholesale-specific
       revenueRange?: string;
       categoriesOfInterest?: string[];
       // Dropship-specific
       websiteUrl?: string;
       platform?: string;
       estimatedMonthlyVolume?: string;
       notes?: string;
     }

     interface Partner {
       id: string;
       companyName: string;
       accountType: 'WHOLESALE' | 'DROPSHIP';
       status: 'ACTIVE' | 'SUSPENDED';
       joinedDate: string;
       lastOrderDate?: string;
       totalOrders: number;
       contactName: string;
       contactEmail: string;
       internalNotes: string;
     }
     ```
   - Mock data: 5-8 pending applications, 10-15 approved partners (mix of wholesale/dropship)
   - Functions: `getApplications(filters?)`, `getApplicationById(id)`, `approveApplication(id, notes)`, `rejectApplication(id, notes)`, `getPartners(filters?)`, `getPartnerById(id)`, `suspendPartner(id, reason)`, `reactivatePartner(id)`, `getPartnerOrders(partnerId)`

#### 16.2 — Partner Applications Page

2. Create `src/app/pages/admin/PartnerApplicationsPage.tsx`:
   - **Table**: Company Name, Account Type (Badge: blue for Wholesale, purple for Dropship), Date Applied, Status Badge (yellow Pending, green Approved, red Rejected)
   - **Filters**: Status Select, Account Type Select
   - **Click row** → expand inline or navigate to detail
   - **Detail view** (expandable row or Dialog/Sheet):
     - All submitted info: company name, reg number, address, contacts
     - Type-specific: wholesale → revenue range, categories; dropship → website, platform, volume
     - **Approve** Button: opens Dialog with optional notes Textarea → calls `approveApplication()` → `toast.success("Application approved")` → refresh list
     - **Reject** Button: opens Dialog with required reason Textarea → calls `rejectApplication()` → toast → refresh
     - Note text: "Notification email would be sent to {email}"

3. Route: `/admin/partners/applications`

#### 16.3 — Partner List Page

4. Create `src/app/pages/admin/PartnerListPage.tsx`:
   - **Table**: Company Name, Type Badge, Joined Date, Status Badge (green Active / red Suspended), Last Order Date, Total Orders
   - **Filters**: Type Select, Status Select, company name Search Input
   - **Click row** → detail view (Sheet or expandable):
     - Business profile info
     - **Suspend** Button (if active): Dialog with reason → `suspendPartner()` → toast
     - **Reactivate** Button (if suspended): confirmation Dialog → `reactivatePartner()` → toast
     - Order history: last 10 orders in mini Table (Order #, Date, Total, Status)
     - Internal notes: Textarea + Save Button

5. Route: `/admin/partners/list`

#### 16.4 — Roles & Permissions Page

6. Create `src/app/pages/admin/RolesPermissionsPage.tsx`:
   - **Permissions matrix** using a grid:
     - **Columns** (roles): Wholesale, Dropship, Admin
     - **Rows** (permissions): View Prices, Place Orders, Download Price Lists, View Invoices, Access Support, View Balance/Ledger, Manage Content, Manage Partners, Manage Pricing
     - Each cell: Checkbox (checked = permission granted)
   - **Save** Button at bottom → `toast.success("Permissions saved")`
   - Keep it simple — this is configuration, not heavy CRUD

7. Route: `/admin/partners/roles`

#### 16.5 — Pricing Admin

8. Create `src/services/pricing-admin.service.ts`:
   - Types: `PricingRule` (categorySlug, productSlug?, visibleToWholesale, visibleToDropship), `MOQRule` (id, categorySlug, productSlug?, minQuantity, unit), `BulkDiscountTier` (id, tierName, minQty, maxQty, discountPercent)
   - Mock data: rules for each category
   - Functions: `getPricingRules()`, `savePricingRules(rules)`, `getMOQRules()`, `saveMOQRule(rule)`, `deleteMOQRule(id)`, `getBulkDiscountTiers()`, `saveBulkDiscountTier(tier)`, `deleteBulkDiscountTier(id)`

9. Create `src/app/pages/admin/PricingAdminPage.tsx`:
   - **Tabs** (shadcn Tabs): Visibility | MOQ Rules | Bulk Discounts
   - **Visibility tab**:
     - Per category section: category name header, then Table of product families
     - Columns: Product Family, Wholesale (Switch toggle), Dropship (Switch toggle)
     - Bulk toggle per category: "Show all to Wholesale" / "Show all to Dropship" Switches
   - **MOQ Rules tab**:
     - Table: Category, Product (or "All"), Min Quantity, Unit
     - Add Rule Button → Dialog form
     - Edit/Delete per row
   - **Bulk Discounts tab**:
     - Table: Tier Name, Min Qty, Max Qty, Discount %
     - Add Tier Button → Dialog form
     - Edit/Delete per row
   - **Save All** Button at bottom of each tab

10. Route: `/admin/pricing`

#### 16.6 — Vendor Management

11. Create `src/services/vendors.service.ts`:
    - Type: `Vendor` (id, name, contactEmail, contactPhone, address, mappedProductFamilies: string[], notes, status: 'active' | 'inactive')
    - Mock data: 4-6 vendors
    - Functions: `getVendors()`, `getVendorById(id)`, `saveVendor(data)`, `deleteVendor(id)`

12. Create `src/app/pages/admin/VendorsPage.tsx`:
    - **Table**: Vendor Name, Contact Email, Products Count, Status Badge
    - **Add Vendor** Button → Dialog form: name, email, phone, address, notes
    - **Click row** → edit Dialog/Sheet:
      - All vendor fields editable
      - **Product Mapping**: multi-select of product families (Popover+Command searchable)
      - Save / Cancel
    - **Delete**: Button in row actions with confirmation Dialog

13. Route: `/admin/vendors`

#### 16.7 — Brand / Whitelabel Settings

14. Create `src/contexts/BrandContext.tsx`:
    ```typescript
    interface BrandConfig {
      brandName: string;
      logoUrl: string;
      logoSecondaryUrl: string;
      faviconUrl: string;
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      emailHeaderHtml: string;
      invoiceHeaderHtml: string;
      domain: string; // read-only
    }
    ```
    - `BrandProvider`: provides brand config from localStorage (persisted mock)
    - Default values: HOMATZ branding (pull current values from Header/Footer)
    - `useBrand()` hook
    - `updateBrand(config: Partial<BrandConfig>)` function in context

15. Wrap app with `BrandProvider` in `src/app/App.tsx`:
    ```tsx
    <BrandProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrandProvider>
    ```

16. Create `src/app/pages/admin/BrandSettingsPage.tsx`:
    - **Brand Identity** Card: Brand Name Input, Primary Logo URL Input + preview, Secondary Logo URL + preview, Favicon URL + preview
    - **Colors** Card: Primary Color (hex Input + color swatch div), Secondary Color, Accent Color. Show a "Preview" strip showing all 3 colors as colored bars
    - **Email Branding** Card: Header Template Textarea, Footer Template Textarea
    - **Document Branding** Card: Invoice Header Template Textarea
    - **Domain** Card: read-only display with note: "Domain configuration is managed by your system administrator"
    - **Save** Button → `updateBrand()` → `toast.success("Brand settings saved")`

17. Route: `/admin/brand`

#### 16.8 — Wire Brand Context

18. Update `src/app/components/Header.tsx`:
    - Import `useBrand()`
    - Replace any hardcoded "HOMATZ" text with `brand.brandName`
    - Replace any hardcoded logo src with `brand.logoUrl`
    - If no hardcoded values exist (already dynamic), wire to BrandContext anyway for consistency

19. Update `src/app/components/Footer.tsx`: same — use `useBrand()` for brand name references.

20. Search for other hardcoded brand references:
    ```bash
    grep -r "HOMATZ\|homatz" src/ --include="*.tsx" --include="*.ts"
    ```
    Update component files to use `useBrand()` where appropriate. **Skip** content data files (`src/content/*`) — those are fine as-is.

#### 16.9 — Route Registration & Verification

21. Register all routes in `src/app/routes.tsx`:
    ```
    /admin/partners/applications  → PartnerApplicationsPage
    /admin/partners/list          → PartnerListPage
    /admin/partners/roles         → RolesPermissionsPage
    /admin/pricing                → PricingAdminPage
    /admin/vendors                → VendorsPage
    /admin/brand                  → BrandSettingsPage
    ```

22. **Verification checklist:**
    - [ ] Partner applications list shows mock data with correct badges
    - [ ] Approve/reject flow works with toast feedback
    - [ ] Partner list shows all mock partners with correct status
    - [ ] Suspend/reactivate works
    - [ ] Pricing visibility toggles work per product/category
    - [ ] MOQ rules CRUD works
    - [ ] Bulk discount tiers CRUD works
    - [ ] Vendor CRUD with product mapping works
    - [ ] Brand settings save → Header/Footer reflect new brand name
    - [ ] Non-admin users cannot access any admin routes
    - [ ] `npm run build` — 0 errors
    - [ ] `npx tsc --noEmit` — 0 type errors

---

## Task 17 — Operations & Internal Management

**Goal**: Build internal operational visibility and workflow tools — order management board, ops dashboard, returns, activity log, admin support view.

**Depends on**: Task 15 (admin layout), Task 16 (partner data)
**Parallel with**: Task 16 if admin layout from Task 15 is complete

### Files to Read First
```
src/layouts/AdminLayout.tsx             — admin sidebar operations section
src/services/orders.service.ts          — order types and patterns
src/services/support.service.ts         — support ticket types
src/types/orders.ts                     — OrderStatus enum
src/types/support.ts                    — ticket types
src/app/routes.tsx                      — route pattern
```

### Files to Create
```
src/services/operations.service.ts
src/app/pages/admin/OrderWorkflowPage.tsx
src/app/pages/admin/OpsDashboardPage.tsx
src/app/pages/admin/ReturnsPage.tsx
src/app/pages/admin/ActivityLogPage.tsx
src/app/pages/admin/AdminSupportPage.tsx
```

### Files to Modify
```
src/app/routes.tsx                      — register operations routes
src/layouts/AdminLayout.tsx             — update operations sidebar links (if needed)
```

### Internal Sub-Agent Strategy

| Sub-Agent | Scope | Parallel? |
|-----------|-------|-----------|
| **17-A** | operations.service.ts + OrderWorkflowPage (biggest page) | First — service needed by others |
| **17-B** | OpsDashboardPage + ActivityLogPage | After 17-A (needs service) |
| **17-C** | ReturnsPage + AdminSupportPage | After 17-A (needs service) |
| **Main** | Route registration + verification | After all sub-agents |

### Step-by-Step Instructions

#### 17.1 — Operations Service

1. Create `src/services/operations.service.ts`:

   **Types** (define at top):
   ```typescript
   interface OperationalOrder {
     id: string;
     orderNumber: string;
     partnerName: string;
     partnerType: 'WHOLESALE' | 'DROPSHIP';
     items: { name: string; qty: number; sku: string }[];
     total: number;
     status: 'NEW' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED';
     assignedTo: string | null;
     internalNotes: string[];
     createdDate: string;
     updatedDate: string;
     statusHistory: { status: string; date: string; user: string }[];
   }

   type ReturnStatus = 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
   type ResolutionType = 'REFUND' | 'REPLACEMENT' | 'CREDIT' | 'REJECTED';

   interface ReturnRequest {
     id: string;
     returnNumber: string;
     orderId: string;
     orderNumber: string;
     partnerName: string;
     reason: 'DAMAGED' | 'WRONG_ITEM' | 'MISSING_ITEM' | 'QUALITY_ISSUE' | 'OTHER';
     description: string;
     status: ReturnStatus;
     resolution?: { type: ResolutionType; notes: string; date: string };
     internalNotes: { text: string; user: string; date: string }[];
     createdDate: string;
     updatedDate: string;
   }

   interface ActivityLogEntry {
     id: string;
     timestamp: string;
     userId: string;
     userName: string;
     actionType: 'ORDER_UPDATE' | 'APPROVAL' | 'CONTENT_EDIT' | 'PRICING_CHANGE' | 'RETURN' | 'LOGIN';
     description: string;
     entityType?: string;
     entityId?: string;
   }

   interface OpsStats {
     pendingFulfilment: number;
     avgFulfilmentDays: number;
     openSupportTickets: number;
     overdueSupportTickets: number;
     ordersByStatus: { status: string; count: number }[];
   }
   ```

   **Mock data**: 15-20 operational orders across all statuses, 5-8 returns, 30+ activity log entries spanning last 30 days.

   **Functions**:
   - `getOperationalOrders(filters?)` → filtered list
   - `getOperationalOrderById(id)` → single order with full detail
   - `updateOrderStatus(id, status, notes?)` → updated order
   - `assignOrder(id, assignee)` → updated order
   - `addInternalNote(id, note)` → updated order
   - `bulkUpdateStatus(ids, status)` → updated orders
   - `getReturns(filters?)` → filtered list
   - `getReturnById(id)` → single return
   - `createReturn(data)` → new return
   - `updateReturnStatus(id, status, resolution?)` → updated return
   - `addReturnNote(id, note)` → updated return
   - `getActivityLog(filters?)` → filtered list
   - `exportActivityLogCSV(filters?)` → CSV string
   - `getOpsStats()` → dashboard stats

#### 17.2 — Order Workflow Board

2. Create `src/app/pages/admin/OrderWorkflowPage.tsx`:

   **View toggle** (shadcn Tabs or toggle Button group): Kanban / Table

   **Kanban View**:
   - 5 columns: New | Processing | Packed | Shipped | Delivered
   - Column header: status name + count Badge
   - Each order card (compact): Order # (bold), Partner name, Items count, Total (£), Date
   - **Drag cards** between columns using `react-dnd`:
     - `useDrag` on each card
     - `useDrop` on each column
     - On drop → `updateOrderStatus(id, newStatus)` → `toast.success("Order status updated")`
   - Cards are visually compact — use `Card` with padding-2

   **Table View**:
   - Table: Checkbox, Order #, Partner, Items, Total, Status (Select dropdown to change inline), Assigned To, Date
   - **Checkbox column** for bulk selection
   - **Bulk actions bar** (appears when items selected): Status Select + "Update Selected" Button → `bulkUpdateStatus()` → toast
   - **Status dropdown** in each row: on change → immediate update + toast

   **Order Detail** (click order → Sheet slide-out from right):
   - Order header: number, partner, date, status Badge
   - Items Table: product, SKU, qty, price
   - **Assign to** Select: options "Sarah", "Mike", "Alex", "Unassigned" → `assignOrder()` → toast
   - **Internal notes** section: existing notes list (each with author + timestamp) + Textarea + "Add Note" Button → `addInternalNote()` → append to list
   - **Status history** timeline: vertical timeline with status changes and dates

   **Filters** (above board/table): Status multi-select, date range, partner name search Input

3. Route: `/admin/operations/orders`

#### 17.3 — Operations Dashboard

4. Create `src/app/pages/admin/OpsDashboardPage.tsx`:

   **Stats row** (4 Cards):
   - Pending Fulfilment: count (large number), "orders" label
   - Avg Fulfilment Time: "X.X days" (large number)
   - Open Support Tickets: count
   - Overdue Tickets: count, red text if > 0

   **Orders by Status chart**: use `recharts` — `BarChart` or `PieChart`
   - Labels: New, Processing, Packed, Shipped, Delivered
   - Colors: distinct per status

   **Recent Activity feed** (Card):
   - Last 20 activity log entries
   - Each entry: timestamp (relative, e.g., "2 hours ago"), user name, action description
   - Scrollable list (max-height with overflow-y-auto)
   - "View All" link → `/admin/operations/logs`

   **Quick links** row: Button cards — "View All Orders", "View Returns", "View Support Tickets"

5. Route: `/admin/operations/dashboard`

#### 17.4 — Returns & Issues

6. Create `src/app/pages/admin/ReturnsPage.tsx`:

   **Table**: Return #, Order # (clickable → opens order in new tab or navigates), Partner Name, Reason (truncated), Status Badge (color-coded), Date

   **Filters**: Status Select, date range

   **Create New Return** Button → Dialog form:
   - Order # Input (with search/lookup)
   - Reason Select: Damaged, Wrong Item, Missing Item, Quality Issue, Other
   - Description Textarea
   - Submit → `createReturn()` → toast → refresh list

   **Click row** → detail view (Sheet or separate section):
   - Return info Card: return #, order # (link), partner, reason, full description, dates
   - **Status flow Buttons**:
     - If REPORTED: "Start Investigation" Button → changes to INVESTIGATING
     - If INVESTIGATING: "Resolve" Button (opens resolution Dialog) + "Reject" Button
     - Resolution Dialog: type Select (Refund/Replacement/Credit), notes Textarea → changes to RESOLVED
     - Reject: reason Textarea → changes to REJECTED
   - **Internal notes**: timeline of notes + "Add Note" Textarea + Button
   - **Link to order**: "View Original Order" Button → `/admin/operations/orders` (or direct link)

7. Route: `/admin/operations/returns`

#### 17.5 — Activity Log

8. Create `src/app/pages/admin/ActivityLogPage.tsx`:

   **Table**: Timestamp (formatted), User Name, Action Type (Badge with color per type), Description, Entity (link if applicable)

   **Filters**:
   - Action Type multi-select: Order Update, Approval, Content Edit, Pricing Change, Return, Login
   - User Select dropdown
   - Date range

   **Pagination**: shadcn Pagination component

   **Export CSV** Button:
   - Call `exportActivityLogCSV(currentFilters)`
   - Create Blob → trigger download via `URL.createObjectURL` + hidden `<a>` click
   - `toast.success("Activity log exported")`

9. Route: `/admin/operations/logs`

#### 17.6 — Admin Support View

10. Create `src/app/pages/admin/AdminSupportPage.tsx`:

    **Table**: Ticket #, Subject, Partner Name, Category Badge, Priority Badge (Normal=grey, High=amber, Urgent=red), Status Badge, Assigned Agent, Created Date

    **Filters**: Status Select, Priority Select, Category Select, partner name Search, Assigned Agent Select

    **Click row** → ticket detail (Sheet or navigate):
    - Ticket info header: subject, partner, status, priority, category, dates
    - **Message thread**: alternating messages (partner messages left-aligned, admin messages right-aligned) with timestamps
    - **Assign to agent** Select: "Sarah", "Mike", "Alex", "Unassigned" → immediate save + toast
    - **Internal notes** section (visually distinct from message thread — different background color, "Internal Only" label):
      - List of admin-only notes with author + timestamp
      - Add note Textarea + Button
    - **Priority escalation** toggle: Switch or Button group (Normal ↔ High ↔ Urgent) → immediate save + toast
    - **Reply as admin**: Textarea + "Send Reply" Button → appears in partner's message thread
    - **Close** Button (if open) / **Reopen** Button (if closed) → confirmation Dialog → update + toast

11. Route: `/admin/operations/support`

#### 17.7 — Route Registration & Verification

12. Register all routes in `src/app/routes.tsx`:
    ```
    /admin/operations/orders     → OrderWorkflowPage
    /admin/operations/dashboard  → OpsDashboardPage
    /admin/operations/returns    → ReturnsPage
    /admin/operations/logs       → ActivityLogPage
    /admin/operations/support    → AdminSupportPage
    ```

13. Update `AdminLayout.tsx` Operations sidebar section to link to these exact routes (if not already matching).

14. **Verification checklist:**
    - [ ] Kanban board renders with mock orders in correct columns
    - [ ] Drag and drop changes order status with toast
    - [ ] Table view bulk update works
    - [ ] Order detail Sheet opens with full info
    - [ ] Internal notes add/display correctly
    - [ ] Ops dashboard charts render with `recharts`
    - [ ] Activity feed shows recent entries
    - [ ] Returns create flow works
    - [ ] Returns status progression works (Reported → Investigating → Resolved/Rejected)
    - [ ] Activity log filters and CSV export work
    - [ ] Admin support view shows all tickets across partners
    - [ ] Agent assignment and priority escalation work
    - [ ] All pages admin-only
    - [ ] `npm run build` — 0 errors
    - [ ] `npx tsc --noEmit` — 0 type errors

---

## Task 18 — Final QA & Production Readiness

**Goal**: Complete platform-wide audit. Fix every visual inconsistency, broken link, missing state, placeholder text, and code quality issue.

**Depends on**: All previous tasks (14–17)
**Cannot be parallelized** with other tasks (needs everything complete)

### Internal Sub-Agent Strategy

Split the audit into parallel sub-agents, each focusing on a different concern:

| Sub-Agent | Focus Area | Actions |
|-----------|------------|---------|
| **18-A** | Visual & Route Audit | Visit all pages, check design consistency, test all links/CTAs/redirects |
| **18-B** | Content & State Audit | Grep for placeholders, verify auth flows, test form validation, check empty/loading states |
| **18-C** | Code Quality | Remove console.log, fix `any` types, check component sizes, fix unused imports, run tsc |
| **Main** | Final build + documentation | npm run build, create route-map.md, test-credentials.md |

All three sub-agents can run in parallel since they read different aspects of the codebase. The main agent merges fixes and runs final build.

### Step-by-Step Instructions

#### 18.1 — Visual Consistency Audit (Sub-Agent 18-A)

1. **Public pages** — verify each renders with consistent design language:
   - `/` (Homepage — locked, just verify it renders)
   - `/category/kitchen-household`, `/category/mats-and-rugs`, `/category/decoration-and-seasonal`, `/category/garden-outdoor`, `/category/toys-games`
   - All 16 product family pages (navigate from each category page)
   - `/about`, `/how-it-works`, `/faq`, `/privacy-policy`, `/terms`, `/shipping`, `/returns`, `/contact`

2. **Auth pages**: `/apply`, `/apply/wholesale`, `/apply/dropship`, `/apply/pending`, `/apply/restricted`, `/login`, `/forgot-password`, `/reset-password`

3. **Portal pages** (mock login as approved partner):
   - `/dashboard`, `/dashboard/orders`, `/dashboard/orders/:id`, `/dashboard/invoices`, `/dashboard/tracking`, `/dashboard/support`, `/dashboard/support/new`, `/dashboard/support/:id`, `/dashboard/account`
   - Wholesale: `/dashboard/price-list`, `/dashboard/moq-info`, `/dashboard/orders/new`, `/dashboard/orders/quick`, `/dashboard/quote-request`
   - Dropship: `/dashboard/dropship`, `/dashboard/dropship/ledger`, `/dashboard/dropship/topup`, `/dashboard/dropship/topup/bank-confirm`, `/dashboard/dropship/statement`

4. **Admin pages** (mock login as admin): all `/admin/*` routes

5. **Design checks per page**:
   - Colors match design tokens (white/neutral BG, dark grey text, yellow accents)
   - Typography consistent (no mismatched sizes/weights)
   - Spacing consistent between sections
   - Cards and buttons use consistent styling
   - No layout overflow or broken responsive behavior

#### 18.2 — Link & Route Audit (Sub-Agent 18-A continued)

6. **Navigation links**: test every link in Header, Footer, Portal sidebar, Admin sidebar

7. **CTA buttons & cards**: test all click-through targets across the platform

8. **Cross-references**:
   - Dashboard → recent orders → order detail → back
   - Order detail → invoice download → invoices page
   - Order detail → tracking → tracking page
   - Category → product cards → product page
   - Product → related products → correct pages
   - Admin order workflow → order detail
   - Admin support → ticket detail

9. **404 page**: navigate to `/nonexistent-route`
   - If no 404 page exists: create `src/app/pages/NotFoundPage.tsx` — Header, Footer, centered content: "Page Not Found" heading, "The page you're looking for doesn't exist." text, "Go Home" Button → `/`
   - Register as catch-all route in `routes.tsx`

10. **Auth redirects**:
    - Unauthenticated → `/dashboard/*` → redirects to `/login`
    - Pending user → `/dashboard/*` → redirects to `/apply/pending`
    - Rejected user → `/dashboard/*` → redirects to `/apply/restricted`
    - Non-admin → `/admin/*` → redirects or forbidden
    - Already authenticated → `/login` → redirects to `/dashboard`

#### 18.3 — Content Audit (Sub-Agent 18-B)

11. Search for placeholder content:
    ```bash
    grep -ri "lorem\|placeholder\|TODO\|FIXME\|coming soon\|TBD\|xxx\|sample text" src/
    ```
    Fix or remove every instance found (except legitimate UI like "Search placeholder...").

12. Verify `src/content/categories.ts`: every category has complete data — no empty strings, no missing required fields.

13. Verify `src/content/product-families.ts`: every product family has complete data.

14. Verify all static pages have real content (not stub text).

#### 18.4 — State & Data Audit (Sub-Agent 18-B continued)

15. **Auth flows**: verify login → correct redirect for: approved (→ dashboard), pending (→ pending page), rejected (→ restricted page).

16. **Account type separation**: wholesale user sees wholesale sidebar/pages but NOT dropship. Dropship sees dropship but NOT wholesale.

17. **BrandContext**: verify `useBrand()` returns values, Header/Footer consume them.

18. **Form validation** on every form:
    - Submit empty → validation errors shown inline
    - Submit invalid data → specific error messages
    - Submit valid data → success (toast + redirect/update)

19. **Loading states**: every page that calls a service should show loading indicator (Skeleton or spinner) while data loads.

20. **Empty states**: every list/table with zero items shows a helpful message + CTA (not a blank page).

21. **Error states**: service calls wrapped in try/catch with user-facing error messages.

#### 18.5 — Code Quality (Sub-Agent 18-C)

22. **TypeScript strict check**:
    ```bash
    npx tsc --noEmit
    ```
    Fix ALL errors. Zero tolerance.

23. **Remove console.log**:
    ```bash
    grep -rn "console\.log" src/
    ```
    Remove every instance.

24. **Remove `any` types**:
    ```bash
    grep -rn ": any" src/
    ```
    Replace with proper interfaces/types.

25. **Component size check**:
    ```bash
    find src -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 300 ] && echo "$1: $lines lines"' _ {} \;
    ```
    Split any >300 line component into sub-components.

26. **Unused imports**: build output flags these. Fix all.

#### 18.6 — Build & Documentation (Main Agent)

27. **Full build**:
    ```bash
    npm run build
    ```
    Must complete with 0 errors.

28. Create `docs/route-map.md`:
    ```markdown
    # HOMATZ Platform — Route Map

    ## Public Pages
    | Route | Page | Description |
    |-------|------|-------------|
    | `/` | HomePage | Main landing page |
    | `/category/:slug` | CategoryPage | Dynamic category page |
    | `/category/:categorySlug/:productSlug` | ProductPage | Dynamic product page |
    | `/about` | AboutPage | About HOMATZ |
    | `/how-it-works` | HowItWorksPage | B2B process explanation |
    | `/faq` | FAQPage | Frequently asked questions |
    | `/privacy-policy` | PrivacyPolicyPage | Privacy policy |
    | `/terms` | TermsPage | Terms and conditions |
    | `/shipping` | ShippingPage | Shipping info |
    | `/returns` | ReturnsPage | Returns policy |
    | `/contact` | ContactPage | Contact & trade enquiry |

    ## Auth Pages
    | Route | Page | Description |
    |-------|------|-------------|
    | `/login` | LoginPage | Partner login |
    | `/forgot-password` | ForgotPasswordPage | Password recovery |
    | `/reset-password` | ResetPasswordPage | Set new password |
    | `/apply` | ApplyPage | B2B access landing |
    | `/apply/wholesale` | ApplyWholesalePage | Wholesale application form |
    | `/apply/dropship` | ApplyDropshipPage | Dropship application form |
    | `/apply/pending` | ApplyPendingPage | Application submitted |
    | `/apply/restricted` | ApplyRestrictedPage | Access restricted |

    ## Partner Portal (requires auth + approved status)
    | Route | Page | Description |
    |-------|------|-------------|
    | `/dashboard` | DashboardPage | Partner dashboard |
    | `/dashboard/orders` | OrdersListPage | Orders list |
    | `/dashboard/orders/:orderId` | OrderDetailPage | Order detail |
    | `/dashboard/invoices` | InvoicesPage | Invoices list |
    | `/dashboard/tracking` | TrackingPage | Shipment tracking |
    | `/dashboard/support` | SupportListPage | Support tickets |
    | `/dashboard/support/new` | NewSupportTicketPage | Create ticket |
    | `/dashboard/support/:ticketId` | SupportTicketDetailPage | Ticket detail |
    | `/dashboard/account` | AccountSettingsPage | Account settings |

    ## Wholesale-Only (requires wholesale account type)
    | Route | Page | Description |
    |-------|------|-------------|
    | `/dashboard/price-list` | PriceListPage | Wholesale price list |
    | `/dashboard/moq-info` | MOQInfoPage | MOQ & ordering rules |
    | `/dashboard/orders/new` | BulkOrderPage | Bulk order form |
    | `/dashboard/orders/quick` | QuickOrderPage | Multi-SKU quick order |
    | `/dashboard/quote-request` | QuoteRequestPage | Request a quote |

    ## Dropship-Only (requires dropship account type)
    | Route | Page | Description |
    |-------|------|-------------|
    | `/dashboard/dropship` | DropshipDashboardPage | Dropship dashboard |
    | `/dashboard/dropship/ledger` | DropshipLedgerPage | Transaction ledger |
    | `/dashboard/dropship/topup` | TopUpPage | Top up funds |
    | `/dashboard/dropship/topup/bank-confirm` | BankTransferConfirmPage | Bank transfer confirmation |
    | `/dashboard/dropship/statement` | DropshipStatementPage | Download statement |

    ## Admin (requires admin role)
    | Route | Page | Description |
    |-------|------|-------------|
    | `/admin/categories` | CategoryListPage | Category CMS list |
    | `/admin/categories/:slug/edit` | CategoryEditPage | Edit category |
    | `/admin/products` | ProductListPage | Product CMS list |
    | `/admin/products/:slug/edit` | ProductEditPage | Edit product |
    | `/admin/pages` | PagesListPage | Static pages CMS |
    | `/admin/pages/:slug/edit` | PageEditPage | Edit page |
    | `/admin/faq` | FAQManagementPage | FAQ management |
    | `/admin/media` | MediaLibraryPage | Media library |
    | `/admin/partners/applications` | PartnerApplicationsPage | Partner applications |
    | `/admin/partners/list` | PartnerListPage | Approved partners |
    | `/admin/partners/roles` | RolesPermissionsPage | Roles & permissions |
    | `/admin/pricing` | PricingAdminPage | Pricing rules |
    | `/admin/vendors` | VendorsPage | Vendor management |
    | `/admin/brand` | BrandSettingsPage | Whitelabel settings |
    | `/admin/operations/orders` | OrderWorkflowPage | Order workflow board |
    | `/admin/operations/dashboard` | OpsDashboardPage | Operations dashboard |
    | `/admin/operations/returns` | ReturnsPage | Returns management |
    | `/admin/operations/logs` | ActivityLogPage | Activity log |
    | `/admin/operations/support` | AdminSupportPage | Admin support view |
    ```

29. Create `docs/test-credentials.md`:
    ```markdown
    # HOMATZ Platform — Test Credentials

    These credentials work with the mock auth service for development and testing.

    ## Wholesale Partner (Approved)
    - Email: wholesale@test.com
    - Password: test123
    - Access: Dashboard, Orders, Invoices, Tracking, Support, Account, Price List, MOQ Info, Bulk Order, Quick Order, Quote Request

    ## Dropship Partner (Approved)
    - Email: dropship@test.com
    - Password: test123
    - Access: Dashboard, Orders, Invoices, Tracking, Support, Account, Dropship Dashboard, Ledger, Top Up, Statement

    ## Pending Partner
    - Email: pending@test.com
    - Password: test123
    - Access: Redirected to /apply/pending on login

    ## Rejected Partner
    - Email: rejected@test.com
    - Password: test123
    - Access: Redirected to /apply/restricted on login

    ## Admin
    - Email: admin@test.com
    - Password: admin123
    - Access: All admin pages + all partner portal pages

    > Note: Adjust credentials above to match your actual mock auth service implementation in `src/services/auth.service.ts`
    ```

30. Final verification:
    ```bash
    npm run build && npx tsc --noEmit
    ```
    Both must pass with 0 errors. Project is production-ready for backend integration.

---

# BACKEND TASKS

> All backend code lives in the `server/` directory at the project root. Frontend code in `src/` is NOT modified by backend tasks (except Task 25 — Integration).
>
> **Stack**: Node.js 20+ · Express 5 · TypeScript 5 · Prisma ORM · PostgreSQL 16 · JWT (jsonwebtoken) · Zod validation · Multer (uploads) · Nodemailer (email) · Jest (testing)

---

## Task 19 — Backend Foundation & Database

**Goal**: Set up the complete backend project structure, Express server, Prisma ORM with PostgreSQL, and database schema covering the full platform.

**Depends on**: Nothing — can start immediately, even in parallel with frontend tasks
**Parallel with**: Frontend Tasks 14–17 (completely separate directory)

### Files to Create

```
server/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── nodemon.json
├── docker-compose.yml              — PostgreSQL + optional pgAdmin
├── prisma/
│   ├── schema.prisma               — Full database schema
│   └── seed.ts                     — Seed data (mirrors frontend mock data)
├── src/
│   ├── app.ts                      — Express app setup (middleware, routes, error handling)
│   ├── server.ts                   — Server entry point (listen)
│   ├── config/
│   │   ├── env.ts                  — Environment variable loader + validation
│   │   └── database.ts             — Prisma client singleton
│   ├── middleware/
│   │   ├── error-handler.ts        — Global error handler
│   │   ├── validate.ts             — Zod validation middleware
│   │   └── cors.ts                 — CORS config
│   ├── utils/
│   │   ├── api-error.ts            — Custom error class (status, message, details)
│   │   ├── api-response.ts         — Standardized response helper
│   │   ├── pagination.ts           — Pagination helper (page, limit, offset, totalPages)
│   │   └── logger.ts               — Simple structured logger
│   └── types/
│       └── express.d.ts            — Express Request augmentation (user property)
```

### Step-by-Step Instructions

#### 19.1 — Project Initialization

1. Create `server/package.json`:
   ```json
   {
     "name": "homatz-api",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "nodemon",
       "build": "tsc",
       "start": "node dist/server.js",
       "db:generate": "prisma generate",
       "db:push": "prisma db push",
       "db:migrate": "prisma migrate dev",
       "db:seed": "tsx prisma/seed.ts",
       "db:studio": "prisma studio",
       "db:reset": "prisma migrate reset",
       "test": "jest --passWithNoTests",
       "lint": "tsc --noEmit"
     },
     "dependencies": {
       "@prisma/client": "^6.0.0",
       "bcryptjs": "^2.4.3",
       "cors": "^2.8.5",
       "dotenv": "^16.4.0",
       "express": "^5.0.0",
       "jsonwebtoken": "^9.0.0",
       "multer": "^1.4.5-lts.1",
       "nodemailer": "^6.9.0",
       "zod": "^3.23.0"
     },
     "devDependencies": {
       "@types/bcryptjs": "^2.4.6",
       "@types/cors": "^2.8.17",
       "@types/express": "^5.0.0",
       "@types/jsonwebtoken": "^9.0.0",
       "@types/multer": "^1.4.12",
       "@types/nodemailer": "^6.4.0",
       "@types/node": "^22.0.0",
       "jest": "^29.7.0",
       "@types/jest": "^29.5.0",
       "ts-jest": "^29.2.0",
       "nodemon": "^3.1.0",
       "prisma": "^6.0.0",
       "tsx": "^4.19.0",
       "typescript": "^5.7.0"
     }
   }
   ```

2. Create `server/tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "Node16",
       "moduleResolution": "Node16",
       "outDir": "dist",
       "rootDir": "src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. Create `server/.env.example`:
   ```env
   # Database
   DATABASE_URL="postgresql://homatz:homatz_dev@localhost:5432/homatz_db?schema=public"

   # JWT
   JWT_SECRET="change-this-to-a-random-secret-in-production"
   JWT_EXPIRES_IN="7d"

   # Server
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"

   # Email (optional — falls back to console log in dev)
   SMTP_HOST=""
   SMTP_PORT=587
   SMTP_USER=""
   SMTP_PASS=""
   SMTP_FROM="noreply@homatz.com"

   # File Uploads
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=5242880
   ```

4. Create `server/docker-compose.yml`:
   ```yaml
   services:
     postgres:
       image: postgres:16-alpine
       environment:
         POSTGRES_USER: homatz
         POSTGRES_PASSWORD: homatz_dev
         POSTGRES_DB: homatz_db
       ports:
         - "5432:5432"
       volumes:
         - pgdata:/var/lib/postgresql/data

     pgadmin:
       image: dpage/pgadmin4:latest
       environment:
         PGADMIN_DEFAULT_EMAIL: admin@homatz.com
         PGADMIN_DEFAULT_PASSWORD: admin
       ports:
         - "5050:80"
       depends_on:
         - postgres

   volumes:
     pgdata:
   ```

5. Create `server/nodemon.json`:
   ```json
   {
     "watch": ["src"],
     "ext": "ts",
     "exec": "tsx src/server.ts"
   }
   ```

#### 19.2 — Prisma Schema

6. Create `server/prisma/schema.prisma` — the COMPLETE database schema for the entire platform:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── AUTH & USERS ───────────────────────────────────────

enum AccountType {
  WHOLESALE
  DROPSHIP
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum UserRole {
  PARTNER
  ADMIN
}

model User {
  id              String         @id @default(cuid())
  email           String         @unique
  passwordHash    String
  companyName     String
  accountType     AccountType
  approvalStatus  ApprovalStatus @default(PENDING)
  role            UserRole       @default(PARTNER)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  profile         BusinessProfile?
  applications    PartnerApplication[]
  orders          Order[]
  supportTickets  SupportTicket[]
  dropshipBalance DropshipBalance?
  activityLogs    ActivityLog[]   @relation("actor")
}

model BusinessProfile {
  id               String  @id @default(cuid())
  userId           String  @unique
  user             User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  contactName      String
  contactEmail     String
  contactPhone     String
  companyRegNumber String?
  addressLine1     String
  addressLine2     String?
  city             String
  postcode         String
  country          String  @default("United Kingdom")
  websiteUrl       String?
  platform         String?
  revenueRange     String?
  estimatedMonthlyVolume String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model PartnerApplication {
  id              String         @id @default(cuid())
  userId          String
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountType     AccountType
  status          ApprovalStatus @default(PENDING)
  businessType    String?
  categoriesOfInterest String[]
  notes           String?
  adminNotes      String?
  reviewedBy      String?
  reviewedAt      DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

// ─── CONTENT & CATALOG ─────────────────────────────────

model Category {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  description     String?
  heroTitle       String?
  heroDescription String?
  heroImage       String?
  intro           String?
  benefits        Json?     // Array of { icon, title, description }
  ctaStrip        Json?     // { headline, description, buttonText, buttonLink }
  seoTitle        String?
  seoDescription  String?
  status          String    @default("published") // published | draft
  sortOrder       Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  subcategories   Subcategory[]
  productFamilies ProductFamily[]
  pricingRules    PricingRule[]
  moqRules        MOQRule[]
}

model Subcategory {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name        String
  slug        String
  description String?
  image       String?
  sortOrder   Int      @default(0)
}

model ProductFamily {
  id              String   @id @default(cuid())
  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name            String
  slug            String   @unique
  summary         String?
  longDescription String?
  features        String[] // Array of feature strings
  useCases        String[] // Array of use case strings
  gallery         String[] // Array of image URLs
  specifications  Json?    // Array of { key, value }
  supportText     String?
  supportContact  String?
  seoTitle        String?
  seoDescription  String?
  status          String   @default("published")
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  variants        ProductVariant[]
  priceListItems  PriceListItem[]
  vendorMappings  VendorProductMapping[]
  orderItems      OrderItem[]
}

model ProductVariant {
  id              String        @id @default(cuid())
  productFamilyId String
  productFamily   ProductFamily @relation(fields: [productFamilyId], references: [id], onDelete: Cascade)
  name            String
  sku             String        @unique
  image           String?
  specs           Json?         // Variant-specific specs { key: value }
  sortOrder       Int           @default(0)
}

model ContentPage {
  id             String   @id @default(cuid())
  title          String
  slug           String   @unique
  body           String
  status         String   @default("published")
  seoTitle       String?
  seoDescription String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model FAQItem {
  id        String   @id @default(cuid())
  question  String
  answer    String
  category  String   @default("General")
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MediaItem {
  id        String   @id @default(cuid())
  filename  String
  url       String
  mimeType  String
  size      Int
  width     Int?
  height    Int?
  createdAt DateTime @default(now())
}

// ─── ORDERS & COMMERCE ─────────────────────────────────

enum OrderStatus {
  NEW
  PROCESSING
  PACKED
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(NEW)
  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2) @default(0)
  total           Decimal     @db.Decimal(10, 2)
  shippingAddress Json        // { name, company, line1, line2, city, postcode, country }
  notes           String?
  assignedTo      String?
  internalNotes   Json?       // Array of { text, user, date }
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
  tracking        TrackingInfo?
  timeline        OrderTimeline[]
  invoice         Invoice?
  returns         ReturnRequest[]
}

model OrderItem {
  id              String        @id @default(cuid())
  orderId         String
  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productFamilyId String?
  productFamily   ProductFamily? @relation(fields: [productFamilyId], references: [id])
  productName     String
  sku             String
  quantity        Int
  unitPrice       Decimal       @db.Decimal(10, 2)
  lineTotal       Decimal       @db.Decimal(10, 2)
}

model OrderTimeline {
  id      String   @id @default(cuid())
  orderId String
  order   Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status  String
  note    String?
  userId  String?
  date    DateTime @default(now())
}

model TrackingInfo {
  id                 String   @id @default(cuid())
  orderId            String   @unique
  order              Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  carrier            String
  trackingNumber     String
  trackingUrl        String?
  estimatedDelivery  DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Invoice {
  id            String   @id @default(cuid())
  invoiceNumber String   @unique
  orderId       String   @unique
  order         Order    @relation(fields: [orderId], references: [id])
  amount        Decimal  @db.Decimal(10, 2)
  status        String   @default("pending") // pending | paid | overdue
  issuedDate    DateTime @default(now())
  dueDate       DateTime
  paidDate      DateTime?
}

// ─── PRICING ────────────────────────────────────────────

model PriceListItem {
  id              String        @id @default(cuid())
  productFamilyId String
  productFamily   ProductFamily @relation(fields: [productFamilyId], references: [id], onDelete: Cascade)
  moq             Int           @default(1)
  unitPrice       Decimal       @db.Decimal(10, 2)
  bulkTiers       Json?         // Array of { minQty, pricePerUnit, label }
  stockStatus     String        @default("In Stock")
}

model PricingRule {
  id                 String   @id @default(cuid())
  categoryId         String?
  category           Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  productFamilySlug  String?
  visibleToWholesale Boolean  @default(true)
  visibleToDropship  Boolean  @default(true)
}

model MOQRule {
  id          String   @id @default(cuid())
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  productSlug String?
  minQuantity Int
  unit        String   @default("units")
  notes       String?
}

model BulkDiscountTier {
  id              String  @id @default(cuid())
  tierName        String
  minQty          Int
  maxQty          Int?
  discountPercent Decimal @db.Decimal(5, 2)
}

// ─── DROPSHIP ───────────────────────────────────────────

model DropshipBalance {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentBalance Decimal  @db.Decimal(10, 2) @default(0)
  currency       String   @default("GBP")
  threshold      Decimal  @db.Decimal(10, 2) @default(50)
  isLocked       Boolean  @default(false)
  updatedAt      DateTime @updatedAt
}

model Transaction {
  id             String   @id @default(cuid())
  userId         String
  type           String   // top-up | order | refund | adjustment
  reference      String
  description    String
  amount         Decimal  @db.Decimal(10, 2) // positive = credit, negative = debit
  runningBalance Decimal  @db.Decimal(10, 2)
  createdAt      DateTime @default(now())
}

model TopUpRequest {
  id        String   @id @default(cuid())
  userId    String
  amount    Decimal  @db.Decimal(10, 2)
  method    String   // bank-transfer | card
  reference String?
  status    String   @default("pending") // pending | confirmed | failed
  proofUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── SUPPORT ────────────────────────────────────────────

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

model SupportTicket {
  id                String         @id @default(cuid())
  ticketNumber      String         @unique
  userId            String
  user              User           @relation(fields: [userId], references: [id])
  subject           String
  category          String         // Order Issue, Product Query, Account, Billing, Other
  status            TicketStatus   @default(OPEN)
  priority          TicketPriority @default(NORMAL)
  relatedOrderId    String?
  assignedTo        String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  messages          TicketMessage[]
  internalNotes     TicketInternalNote[]
}

model TicketMessage {
  id        String   @id @default(cuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  author    String   // partner | support
  authorName String
  body      String
  createdAt DateTime @default(now())
}

model TicketInternalNote {
  id        String   @id @default(cuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  authorName String
  body      String
  createdAt DateTime @default(now())
}

// ─── RETURNS ────────────────────────────────────────────

enum ReturnStatus {
  REPORTED
  INVESTIGATING
  RESOLVED
  REJECTED
}

model ReturnRequest {
  id             String       @id @default(cuid())
  returnNumber   String       @unique
  orderId        String
  order          Order        @relation(fields: [orderId], references: [id])
  partnerName    String
  reason         String       // DAMAGED, WRONG_ITEM, MISSING_ITEM, QUALITY_ISSUE, OTHER
  description    String
  status         ReturnStatus @default(REPORTED)
  resolutionType String?      // REFUND, REPLACEMENT, CREDIT, REJECTED
  resolutionNotes String?
  resolvedAt     DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  notes          ReturnNote[]
}

model ReturnNote {
  id        String        @id @default(cuid())
  returnId  String
  return_   ReturnRequest @relation(fields: [returnId], references: [id], onDelete: Cascade)
  authorName String
  body      String
  createdAt DateTime      @default(now())
}

// ─── VENDORS ────────────────────────────────────────────

model Vendor {
  id           String   @id @default(cuid())
  name         String
  contactEmail String
  contactPhone String?
  address      String?
  notes        String?
  status       String   @default("active") // active | inactive
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  productMappings VendorProductMapping[]
}

model VendorProductMapping {
  id              String        @id @default(cuid())
  vendorId        String
  vendor          Vendor        @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  productFamilyId String
  productFamily   ProductFamily @relation(fields: [productFamilyId], references: [id], onDelete: Cascade)

  @@unique([vendorId, productFamilyId])
}

// ─── BRAND / WHITELABEL ─────────────────────────────────

model BrandConfig {
  id                String  @id @default(cuid())
  brandName         String  @default("HOMATZ")
  logoUrl           String?
  logoSecondaryUrl  String?
  faviconUrl        String?
  primaryColor      String  @default("#1a1a1a")
  secondaryColor    String  @default("#f5f5f5")
  accentColor       String  @default("#f59e0b")
  emailHeaderHtml   String?
  invoiceHeaderHtml String?
  domain            String?
}

// ─── ACTIVITY LOG ───────────────────────────────────────

model ActivityLog {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation("actor", fields: [userId], references: [id])
  userName    String
  actionType  String   // ORDER_UPDATE, APPROVAL, CONTENT_EDIT, PRICING_CHANGE, RETURN, LOGIN
  description String
  entityType  String?  // Order, Category, Product, Partner, etc.
  entityId    String?
  createdAt   DateTime @default(now())
}

// ─── QUOTE REQUESTS ─────────────────────────────────────

model QuoteRequest {
  id                  String   @id @default(cuid())
  referenceNumber     String   @unique
  userId              String
  lines               Json     // Array of { productSlug, sku, quantity }
  specialRequirements String?
  status              String   @default("pending") // pending | quoted | expired
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

#### 19.3 — Core Utilities

7. Create `server/src/config/env.ts`:
   - Load `.env` with `dotenv`
   - Export typed `env` object with all vars
   - Validate required vars are present on startup (DATABASE_URL, JWT_SECRET)
   - Throw readable error if missing

8. Create `server/src/config/database.ts`:
   - Export a singleton `PrismaClient` instance
   - Add logging in development mode
   - Handle graceful shutdown (`process.on('beforeExit')`)

9. Create `server/src/utils/api-error.ts`:
   ```typescript
   export class ApiError extends Error {
     constructor(
       public statusCode: number,
       message: string,
       public details?: Record<string, unknown>
     ) {
       super(message);
       this.name = 'ApiError';
     }

     static badRequest(message: string, details?: Record<string, unknown>) { return new ApiError(400, message, details); }
     static unauthorized(message = 'Unauthorized') { return new ApiError(401, message); }
     static forbidden(message = 'Forbidden') { return new ApiError(403, message); }
     static notFound(message = 'Not found') { return new ApiError(404, message); }
     static conflict(message: string) { return new ApiError(409, message); }
     static internal(message = 'Internal server error') { return new ApiError(500, message); }
   }
   ```

10. Create `server/src/utils/api-response.ts`:
    ```typescript
    export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
      return { success: true, data, ...(meta && { meta }) };
    }

    export function apiPaginated<T>(data: T[], total: number, page: number, limit: number) {
      return {
        success: true,
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
      };
    }
    ```

11. Create `server/src/utils/pagination.ts`:
    ```typescript
    export function parsePagination(query: { page?: string; limit?: string }) {
      const page = Math.max(1, parseInt(query.page || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
      const offset = (page - 1) * limit;
      return { page, limit, offset };
    }
    ```

12. Create `server/src/utils/logger.ts` — simple structured logger (console-based, easy to swap for winston/pino later).

13. Create `server/src/types/express.d.ts`:
    ```typescript
    import { User } from '@prisma/client';
    declare global {
      namespace Express {
        interface Request {
          user?: User;
        }
      }
    }
    ```

#### 19.4 — Express App Setup

14. Create `server/src/middleware/error-handler.ts`:
    - Catch `ApiError` → return `{ success: false, error: message, details }` with correct status
    - Catch Prisma errors → map to 400/404/409 as appropriate
    - Catch Zod errors → return 400 with field-level errors
    - Catch unknown → 500 with generic message (log full error)

15. Create `server/src/middleware/validate.ts`:
    ```typescript
    import { ZodSchema } from 'zod';
    import { Request, Response, NextFunction } from 'express';

    export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
      return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
          // throw ApiError.badRequest with formatted Zod errors
        }
        req[source] = result.data;
        next();
      };
    }
    ```

16. Create `server/src/middleware/cors.ts`:
    - Allow `FRONTEND_URL` origin
    - Allow credentials
    - Standard headers

17. Create `server/src/app.ts`:
    ```typescript
    import express from 'express';
    import cors from 'cors';
    import { corsConfig } from './middleware/cors.js';
    import { errorHandler } from './middleware/error-handler.js';

    const app = express();

    // Middleware
    app.use(cors(corsConfig));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes will be mounted here by subsequent tasks:
    // app.use('/api/auth', authRoutes);
    // app.use('/api/categories', categoryRoutes);
    // etc.

    // Error handler (must be last)
    app.use(errorHandler);

    export default app;
    ```

18. Create `server/src/server.ts`:
    ```typescript
    import app from './app.js';
    import { env } from './config/env.js';
    import { logger } from './utils/logger.js';

    const PORT = env.PORT || 4000;

    app.listen(PORT, () => {
      logger.info(`HOMATZ API running on port ${PORT}`);
    });
    ```

#### 19.5 — Seed Data

19. Create `server/prisma/seed.ts`:
    - Seed all tables with realistic data that matches the frontend mock data
    - Create users: wholesale partner (approved), dropship partner (approved), pending partner, rejected partner, admin
    - Seed 5 categories with subcategories (matching `categories.ts`)
    - Seed all 16 product families with variants (matching `product-families.ts`)
    - Seed 10 orders with items, tracking, timelines, invoices
    - Seed 5 support tickets with messages
    - Seed dropship balance + transactions for dropship user
    - Seed FAQ items, content pages, vendors, brand config, pricing rules
    - Seed activity log entries
    - Use `bcryptjs` for password hashing in seed
    - Passwords for all test users: `test123` (admin: `admin123`)

#### 19.6 — Verification

20. Run:
    ```bash
    cd server && npm install
    docker compose up -d
    cp .env.example .env
    npx prisma generate
    npx prisma db push
    npx tsx prisma/seed.ts
    npx tsc --noEmit
    npm run dev
    ```
    Verify: server starts, `GET /api/health` returns `{ status: "ok" }`, database has seeded data.

---

## Task 20 — Auth API & JWT

**Goal**: Build authentication endpoints — registration, login, token refresh, password reset, and the auth middleware that protects all other routes.

**Depends on**: Task 19 (backend foundation)
**Parallel with**: Tasks 21, 22 (different route files)

### Files to Create
```
server/src/middleware/auth.ts            — JWT verification middleware
server/src/routes/auth.ts               — Auth route definitions
server/src/services/auth.service.ts     — Auth business logic
server/src/validators/auth.validators.ts — Zod schemas for auth
```

### Files to Modify
```
server/src/app.ts                       — Mount auth routes
```

### Step-by-Step Instructions

#### 20.1 — Auth Middleware

1. Create `server/src/middleware/auth.ts`:
   - `authenticate` middleware: extract Bearer token from `Authorization` header → verify with `jsonwebtoken` → look up user by ID from token payload → attach `req.user` → call `next()`
   - If no token → `ApiError.unauthorized("Authentication required")`
   - If invalid/expired token → `ApiError.unauthorized("Invalid or expired token")`
   - If user not found → `ApiError.unauthorized("User not found")`
   - `requireApproved` middleware: check `req.user.approvalStatus === 'APPROVED'` — if PENDING → 403 "Account pending approval", if REJECTED → 403 "Account access restricted"
   - `requireAdmin` middleware: check `req.user.role === 'ADMIN'` — if not → `ApiError.forbidden("Admin access required")`
   - `requireAccountType(type: AccountType)` middleware: check `req.user.accountType` matches

#### 20.2 — Auth Validators

2. Create `server/src/validators/auth.validators.ts` using Zod:
   ```typescript
   import { z } from 'zod';

   export const registerSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8, 'Password must be at least 8 characters'),
     companyName: z.string().min(2),
     accountType: z.enum(['WHOLESALE', 'DROPSHIP']),
     contactName: z.string().min(2),
     contactPhone: z.string().min(5),
     companyRegNumber: z.string().optional(),
     addressLine1: z.string().min(3),
     addressLine2: z.string().optional(),
     city: z.string().min(2),
     postcode: z.string().min(3),
     country: z.string().default('United Kingdom'),
     // Wholesale-specific
     businessType: z.string().optional(),
     revenueRange: z.string().optional(),
     categoriesOfInterest: z.array(z.string()).optional(),
     // Dropship-specific
     websiteUrl: z.string().url().optional(),
     platform: z.string().optional(),
     estimatedMonthlyVolume: z.string().optional(),
   });

   export const loginSchema = z.object({
     email: z.string().email(),
     password: z.string().min(1, 'Password is required'),
   });

   export const forgotPasswordSchema = z.object({
     email: z.string().email(),
   });

   export const resetPasswordSchema = z.object({
     token: z.string(),
     password: z.string().min(8),
     confirmPassword: z.string(),
   }).refine(data => data.password === data.confirmPassword, {
     message: 'Passwords do not match',
     path: ['confirmPassword'],
   });

   export const changePasswordSchema = z.object({
     currentPassword: z.string(),
     newPassword: z.string().min(8),
     confirmPassword: z.string(),
   }).refine(data => data.newPassword === data.confirmPassword, {
     message: 'Passwords do not match',
     path: ['confirmPassword'],
   });
   ```

#### 20.3 — Auth Service

3. Create `server/src/services/auth.service.ts`:
   - `register(data)`: validate email uniqueness → hash password with `bcryptjs` (12 rounds) → create User + BusinessProfile + PartnerApplication in a transaction → generate JWT → return `{ user, token }`
   - `login(email, password)`: find user → compare password → generate JWT → log activity → return `{ user, token, approvalStatus }`
   - `generateToken(user)`: sign JWT with user `id` and `role`, expires per `JWT_EXPIRES_IN`
   - `getCurrentUser(userId)`: find user with profile → return user data (exclude passwordHash)
   - `forgotPassword(email)`: find user → generate reset token (random UUID stored in a `PasswordReset` model or simple token field) → log "would send email" in dev → return success
   - `resetPassword(token, newPassword)`: validate token → hash new password → update user → invalidate token
   - `changePassword(userId, currentPassword, newPassword)`: verify current → hash new → update

#### 20.4 — Auth Routes

4. Create `server/src/routes/auth.ts`:

   | Method | Path | Middleware | Handler | Description |
   |--------|------|-----------|---------|-------------|
   | POST | `/api/auth/register` | validate(registerSchema) | Register new partner | |
   | POST | `/api/auth/login` | validate(loginSchema) | Login, return JWT + user | |
   | GET | `/api/auth/me` | authenticate | Get current user profile | |
   | POST | `/api/auth/forgot-password` | validate(forgotPasswordSchema) | Request password reset | |
   | POST | `/api/auth/reset-password` | validate(resetPasswordSchema) | Reset password with token | |
   | POST | `/api/auth/change-password` | authenticate, validate(changePasswordSchema) | Change password | |
   | POST | `/api/auth/logout` | authenticate | Logout (client-side token removal, server-side log) | |

   Response format for login:
   ```json
   {
     "success": true,
     "data": {
       "user": { "id", "email", "companyName", "accountType", "approvalStatus", "role" },
       "token": "jwt-token-here"
     }
   }
   ```

5. Mount in `server/src/app.ts`: `app.use('/api/auth', authRoutes);`

#### 20.5 — Verification

6. Run:
   ```bash
   cd server && npm run dev
   ```
   Test with curl or any HTTP client:
   - `POST /api/auth/login` with `{ email: "wholesale@test.com", password: "test123" }` → returns token
   - `GET /api/auth/me` with Bearer token → returns user
   - `POST /api/auth/register` with full body → creates user with PENDING status
   - `POST /api/auth/login` without credentials → 400
   - `GET /api/auth/me` without token → 401
   - `npx tsc --noEmit` — 0 errors

---

## Task 21 — Content & Catalog API

**Goal**: Build REST API endpoints for categories, product families, content pages, and FAQ — both public (read) and admin (CRUD).

**Depends on**: Task 19 (backend foundation)
**Parallel with**: Tasks 20, 22 (different route files)

### Files to Create
```
server/src/routes/categories.ts
server/src/routes/products.ts
server/src/routes/pages.ts
server/src/routes/faq.ts
server/src/services/catalog.service.ts
server/src/validators/catalog.validators.ts
```

### Files to Modify
```
server/src/app.ts                       — Mount routes
```

### Step-by-Step Instructions

#### 21.1 — Catalog Service

1. Create `server/src/services/catalog.service.ts`:
   - **Categories**: `getCategories(filters?)`, `getCategoryBySlug(slug)` (include subcategories + product count), `createCategory(data)`, `updateCategory(slug, data)`, `deleteCategory(slug)` (check no products linked), `reorderCategories(slugs[])`
   - **Products**: `getProducts(filters?)` (filter by category, search, pagination), `getProductBySlug(slug)` (include variants, category), `createProduct(data)`, `updateProduct(slug, data)`, `deleteProduct(slug)`, `getRelatedProducts(slug)`
   - **Pages**: `getPages(filters?)`, `getPageBySlug(slug)`, `createPage(data)`, `updatePage(slug, data)`, `deletePage(slug)`
   - **FAQ**: `getFAQItems(category?)`, `createFAQItem(data)`, `updateFAQItem(id, data)`, `deleteFAQItem(id)`, `reorderFAQItems(items[])`
   - All functions use Prisma client
   - Include proper error handling (not found → `ApiError.notFound()`)

#### 21.2 — Validators

2. Create `server/src/validators/catalog.validators.ts`:
   - `categorySchema`: name (required), slug, heroTitle, heroDescription, heroImage, intro, benefits (json), ctaStrip (json), subcategories (array), seoTitle, seoDescription, status
   - `productSchema`: name (required), slug, categoryId (required), summary, longDescription, features (string[]), useCases (string[]), gallery (string[]), specifications (json), variants (array of { name, sku, image, specs }), seoTitle, seoDescription, status
   - `pageSchema`: title (required), slug, body (required), status, seoTitle, seoDescription
   - `faqSchema`: question (required), answer (required), category, sortOrder

#### 21.3 — Category Routes

3. Create `server/src/routes/categories.ts`:

   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/api/categories` | — (public) | List all published categories |
   | GET | `/api/categories/:slug` | — (public) | Get category by slug with subcategories + products |
   | POST | `/api/categories` | authenticate, requireAdmin, validate | Create category |
   | PUT | `/api/categories/:slug` | authenticate, requireAdmin, validate | Update category |
   | DELETE | `/api/categories/:slug` | authenticate, requireAdmin | Delete category |
   | PUT | `/api/categories/reorder` | authenticate, requireAdmin | Reorder categories |

   Public GET routes only return `status: "published"` items.

#### 21.4 — Product Routes

4. Create `server/src/routes/products.ts`:

   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/api/products` | — (public) | List products (filter by category, search, paginate) |
   | GET | `/api/products/:slug` | — (public) | Get product by slug with variants + category |
   | GET | `/api/products/:slug/related` | — (public) | Get related products |
   | POST | `/api/products` | authenticate, requireAdmin, validate | Create product |
   | PUT | `/api/products/:slug` | authenticate, requireAdmin, validate | Update product |
   | DELETE | `/api/products/:slug` | authenticate, requireAdmin | Delete product |

#### 21.5 — Pages & FAQ Routes

5. Create `server/src/routes/pages.ts`:

   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/api/pages` | — (public) | List published pages |
   | GET | `/api/pages/:slug` | — (public) | Get page by slug |
   | POST | `/api/pages` | authenticate, requireAdmin, validate | Create page |
   | PUT | `/api/pages/:slug` | authenticate, requireAdmin, validate | Update page |
   | DELETE | `/api/pages/:slug` | authenticate, requireAdmin | Delete page |

6. Create `server/src/routes/faq.ts`:

   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/api/faq` | — (public) | List all FAQ items (optional category filter) |
   | POST | `/api/faq` | authenticate, requireAdmin, validate | Create FAQ item |
   | PUT | `/api/faq/:id` | authenticate, requireAdmin, validate | Update FAQ item |
   | DELETE | `/api/faq/:id` | authenticate, requireAdmin | Delete FAQ item |
   | PUT | `/api/faq/reorder` | authenticate, requireAdmin | Reorder FAQ items |

7. Mount all routes in `server/src/app.ts`.

#### 21.6 — Verification

8. Test all CRUD operations:
   - Public: `GET /api/categories` → returns published categories
   - Public: `GET /api/categories/kitchen-household` → returns category with subcategories
   - Public: `GET /api/products?category=kitchen-household` → returns filtered products
   - Admin: `POST /api/categories` with auth token → creates category
   - Admin: `PUT /api/products/stock-pot` → updates product
   - Unauthenticated admin routes → 401
   - Non-admin on admin routes → 403
   - `npx tsc --noEmit` — 0 errors

---

## Task 22 — Partner & Commerce API

**Goal**: Build API endpoints for orders, invoices, tracking, support, pricing, and dropship balance/ledger.

**Depends on**: Task 19 (backend foundation)
**Parallel with**: Tasks 20, 21 (different route files)

### Files to Create
```
server/src/routes/orders.ts
server/src/routes/invoices.ts
server/src/routes/tracking.ts
server/src/routes/support.ts
server/src/routes/pricing.ts
server/src/routes/dropship.ts
server/src/services/commerce.service.ts
server/src/services/dropship.service.ts
server/src/services/support.service.ts
server/src/validators/commerce.validators.ts
```

### Files to Modify
```
server/src/app.ts                       — Mount routes
```

### Step-by-Step Instructions

#### 22.1 — Commerce Service

1. Create `server/src/services/commerce.service.ts`:
   - **Orders**: `getOrders(userId, filters)`, `getOrderById(userId, orderId)`, `createOrder(userId, data)`, `cancelOrder(userId, orderId)`, `reorder(userId, orderId)`
   - Order creation: validate items exist, check stock, calculate totals, check MOQ, check dropship balance if applicable, create order + items + initial timeline entry in transaction
   - If dropship: debit balance, create transaction, check threshold lock
   - **Invoices**: `getInvoices(userId, filters)`, `getInvoiceById(userId, invoiceId)`, `generateInvoicePDF(invoiceId)` (returns mock PDF buffer or placeholder)
   - **Tracking**: `getActiveShipments(userId)`, `getTrackingByOrderId(userId, orderId)`
   - **Pricing**: `getPriceList(userId)` (filter by user's account type visibility rules), `getMOQRules()`, `getBulkDiscountTiers()`
   - **Quote**: `createQuoteRequest(userId, data)`, `getQuoteRequests(userId)`

#### 22.2 — Dropship Service

2. Create `server/src/services/dropship.service.ts`:
   - `getBalance(userId)`: return current balance, threshold, locked status
   - `getTransactions(userId, filters)`: paginated transaction list with date range + type filter
   - `getRecentTransactions(userId, limit)`: last N transactions
   - `submitTopUp(userId, data)`: create TopUpRequest, return reference
   - `confirmTopUp(topUpId)`: admin action — update balance, create transaction, check if lock should be released
   - `getBalanceHistory(userId, days)`: aggregate daily balance for chart
   - `getStatement(userId, startDate, endDate)`: return transactions for date range
   - `checkThreshold(userId)`: check balance against threshold, update lock status

#### 22.3 — Support Service

3. Create `server/src/services/support.service.ts`:
   - `getTickets(userId, filters)`: partner's own tickets, paginated
   - `getTicketById(userId, ticketId)`: with messages (exclude internal notes for partners)
   - `createTicket(userId, data)`: create ticket + initial message, generate ticket number
   - `addMessage(userId, ticketId, body)`: add partner message
   - `closeTicket(userId, ticketId)`: partner can close own ticket

#### 22.4 — Commerce Validators

4. Create `server/src/validators/commerce.validators.ts`:
   - `createOrderSchema`: items (array of { productSlug, sku, quantity }), shippingAddress, notes
   - `topUpSchema`: amount (positive number), method (bank-transfer | card)
   - `createTicketSchema`: subject, category, relatedOrderId (optional), body
   - `ticketMessageSchema`: body (required)
   - `quoteRequestSchema`: lines (array of { productSlug, sku, quantity }), specialRequirements

#### 22.5 — Routes

5. Create all route files:

   **Orders** (`/api/orders`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/` | authenticate, requireApproved | List user's orders (paginated, filterable) |
   | GET | `/:id` | authenticate, requireApproved | Get order detail |
   | POST | `/` | authenticate, requireApproved, validate | Create new order |
   | POST | `/:id/cancel` | authenticate, requireApproved | Cancel order (if eligible) |
   | POST | `/:id/reorder` | authenticate, requireApproved | Reorder (clone as new) |

   **Invoices** (`/api/invoices`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/` | authenticate, requireApproved | List user's invoices |
   | GET | `/:id` | authenticate, requireApproved | Get invoice detail |
   | GET | `/:id/download` | authenticate, requireApproved | Download invoice (mock PDF) |

   **Tracking** (`/api/tracking`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/` | authenticate, requireApproved | List active shipments |
   | GET | `/order/:orderId` | authenticate, requireApproved | Get tracking for order |

   **Support** (`/api/support`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/` | authenticate, requireApproved | List user's tickets |
   | GET | `/:id` | authenticate, requireApproved | Get ticket with messages |
   | POST | `/` | authenticate, requireApproved, validate | Create ticket |
   | POST | `/:id/messages` | authenticate, requireApproved, validate | Add message |
   | POST | `/:id/close` | authenticate, requireApproved | Close ticket |

   **Pricing** (`/api/pricing`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/price-list` | authenticate, requireApproved | Get price list (filtered by account type) |
   | GET | `/moq-rules` | authenticate, requireApproved | Get MOQ rules |
   | GET | `/bulk-discounts` | authenticate, requireApproved | Get bulk discount tiers |
   | POST | `/quote-request` | authenticate, requireApproved, validate | Submit quote request |
   | GET | `/quote-requests` | authenticate, requireApproved | List user's quote requests |

   **Dropship** (`/api/dropship`):
   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/balance` | authenticate, requireApproved, requireAccountType('DROPSHIP') | Get balance + threshold |
   | GET | `/transactions` | authenticate, requireApproved, requireAccountType('DROPSHIP') | List transactions (paginated) |
   | GET | `/transactions/recent` | authenticate, requireApproved, requireAccountType('DROPSHIP') | Recent transactions |
   | POST | `/topup` | authenticate, requireApproved, requireAccountType('DROPSHIP'), validate | Submit top-up |
   | GET | `/balance-history` | authenticate, requireApproved, requireAccountType('DROPSHIP') | Balance history for chart |
   | GET | `/statement` | authenticate, requireApproved, requireAccountType('DROPSHIP') | Statement for date range |

6. Mount all routes in `server/src/app.ts`.

#### 22.6 — Verification

7. Test key flows:
   - Login as wholesale → `GET /api/pricing/price-list` → returns visible items
   - Login as dropship → `GET /api/dropship/balance` → returns balance
   - `POST /api/orders` with valid data → creates order
   - `POST /api/support` → creates ticket, `POST /api/support/:id/messages` → adds message
   - `POST /api/dropship/topup` → creates top-up request
   - Wholesale user → `GET /api/dropship/balance` → 403
   - `npx tsc --noEmit` — 0 errors

---

## Task 23 — Admin & Operations API

**Goal**: Build admin-only API endpoints for partner management, pricing rules, vendor management, brand settings, order workflow, returns, activity log, and admin support.

**Depends on**: Tasks 20, 21, 22 (uses auth middleware + existing services)
**Parallel with**: Task 24 (different file domains)

### Files to Create
```
server/src/routes/admin/partners.ts
server/src/routes/admin/pricing.ts
server/src/routes/admin/vendors.ts
server/src/routes/admin/brand.ts
server/src/routes/admin/operations.ts
server/src/routes/admin/support.ts
server/src/services/admin.service.ts
server/src/services/operations.service.ts
server/src/validators/admin.validators.ts
```

### Files to Modify
```
server/src/app.ts                       — Mount admin routes
```

### Step-by-Step Instructions

#### 23.1 — Admin Service

1. Create `server/src/services/admin.service.ts`:
   - **Partners**: `getApplications(filters)`, `getApplicationById(id)`, `approveApplication(id, adminId, notes)`, `rejectApplication(id, adminId, notes)`, `getPartners(filters)`, `getPartnerById(id)`, `suspendPartner(id, reason)`, `reactivatePartner(id)`, `getPartnerOrders(partnerId)`
   - Approve: update application status + user approvalStatus → log activity → "would send email"
   - Reject: update status → log activity
   - **Pricing Admin**: `getPricingRules()`, `savePricingRules(rules)`, `getMOQRules()`, `saveMOQRule(data)`, `deleteMOQRule(id)`, `getBulkDiscountTiers()`, `saveBulkDiscountTier(data)`, `deleteBulkDiscountTier(id)`
   - **Vendors**: `getVendors()`, `getVendorById(id)`, `createVendor(data)`, `updateVendor(id, data)`, `deleteVendor(id)`
   - **Brand**: `getBrandConfig()`, `updateBrandConfig(data)`

#### 23.2 — Operations Service

2. Create `server/src/services/operations.service.ts`:
   - **Order workflow**: `getOperationalOrders(filters)` (all orders, not user-filtered), `updateOrderStatus(orderId, status, adminId, notes?)`, `assignOrder(orderId, assignee, adminId)`, `addInternalNote(orderId, note, adminId)`, `bulkUpdateStatus(orderIds, status, adminId)`
   - Each status change → create OrderTimeline entry + ActivityLog entry
   - **Returns**: `getReturns(filters)`, `getReturnById(id)`, `createReturn(data, adminId)`, `updateReturnStatus(id, status, resolution?, adminId)`, `addReturnNote(id, note, adminId)`
   - **Activity Log**: `getActivityLog(filters)` (paginated, filterable by type/user/date), `exportActivityLogCSV(filters)` (return CSV string)
   - **Admin Support**: `getAllTickets(filters)` (cross-partner), `assignTicket(ticketId, agentName, adminId)`, `addInternalNote(ticketId, note, adminId)`, `escalatePriority(ticketId, priority, adminId)`, `adminReply(ticketId, body, adminName)`, `closeTicket(ticketId, adminId)`, `reopenTicket(ticketId, adminId)`
   - **Ops Stats**: `getOpsStats()` → pending fulfilment count, avg fulfilment time, open/overdue tickets, orders by status

#### 23.3 — Admin Routes

3. All admin routes use `authenticate` + `requireAdmin` middleware.

   **Partners** (`/api/admin/partners`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/applications` | List applications (filter by status, type) |
   | GET | `/applications/:id` | Get application detail |
   | POST | `/applications/:id/approve` | Approve with notes |
   | POST | `/applications/:id/reject` | Reject with notes |
   | GET | `/` | List all partners |
   | GET | `/:id` | Get partner detail + recent orders |
   | POST | `/:id/suspend` | Suspend partner |
   | POST | `/:id/reactivate` | Reactivate partner |

   **Pricing** (`/api/admin/pricing`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/rules` | Get all pricing visibility rules |
   | PUT | `/rules` | Save pricing rules (bulk) |
   | GET | `/moq` | Get MOQ rules |
   | POST | `/moq` | Create MOQ rule |
   | PUT | `/moq/:id` | Update MOQ rule |
   | DELETE | `/moq/:id` | Delete MOQ rule |
   | GET | `/bulk-discounts` | Get bulk discount tiers |
   | POST | `/bulk-discounts` | Create tier |
   | PUT | `/bulk-discounts/:id` | Update tier |
   | DELETE | `/bulk-discounts/:id` | Delete tier |

   **Vendors** (`/api/admin/vendors`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/` | List vendors |
   | GET | `/:id` | Get vendor detail |
   | POST | `/` | Create vendor |
   | PUT | `/:id` | Update vendor |
   | DELETE | `/:id` | Delete vendor |

   **Brand** (`/api/admin/brand`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/` | Get brand config |
   | PUT | `/` | Update brand config |

   **Operations** (`/api/admin/operations`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/stats` | Get ops dashboard stats |
   | GET | `/orders` | List all orders (operational view, filterable) |
   | PUT | `/orders/:id/status` | Update order status |
   | PUT | `/orders/:id/assign` | Assign order |
   | POST | `/orders/:id/notes` | Add internal note |
   | PUT | `/orders/bulk-status` | Bulk update order statuses |
   | GET | `/returns` | List returns |
   | GET | `/returns/:id` | Get return detail |
   | POST | `/returns` | Create return |
   | PUT | `/returns/:id/status` | Update return status + resolution |
   | POST | `/returns/:id/notes` | Add return note |
   | GET | `/activity-log` | Get activity log (paginated, filterable) |
   | GET | `/activity-log/export` | Export as CSV |

   **Admin Support** (`/api/admin/support`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/` | List all tickets (cross-partner, filterable) |
   | GET | `/:id` | Get ticket with messages + internal notes |
   | PUT | `/:id/assign` | Assign to agent |
   | POST | `/:id/internal-notes` | Add internal note |
   | PUT | `/:id/priority` | Escalate/change priority |
   | POST | `/:id/reply` | Admin reply (visible to partner) |
   | POST | `/:id/close` | Close ticket |
   | POST | `/:id/reopen` | Reopen ticket |

   **Top-up confirmation** (`/api/admin/topups`):
   | Method | Path | Description |
   |--------|------|-------------|
   | GET | `/pending` | List pending top-ups |
   | POST | `/:id/confirm` | Confirm top-up (credits balance) |
   | POST | `/:id/reject` | Reject top-up |

4. Mount all admin routes in `server/src/app.ts` under `/api/admin/*`.

#### 23.4 — Verification

5. Test:
   - Admin login → all admin endpoints accessible
   - Partner login → all `/api/admin/*` → 403
   - Approve application → user status changes to APPROVED
   - Update order status → timeline entry created + activity log entry
   - Confirm top-up → dropship balance increases + transaction created
   - `npx tsc --noEmit` — 0 errors

---

## Task 24 — File Uploads & Email

**Goal**: Build file upload handling (product images, media library, proof of payment) and email notification service.

**Depends on**: Task 19 (backend foundation)
**Parallel with**: Task 23 (different services)

### Files to Create
```
server/src/services/upload.service.ts
server/src/services/email.service.ts
server/src/routes/media.ts
server/src/templates/                   — Email templates directory
server/src/templates/welcome.ts
server/src/templates/application-approved.ts
server/src/templates/application-rejected.ts
server/src/templates/order-confirmation.ts
server/src/templates/password-reset.ts
server/uploads/                         — Upload directory (gitignored)
```

### Files to Modify
```
server/src/app.ts                       — Mount media routes, serve static uploads
server/.gitignore                       — Add uploads/
```

### Step-by-Step Instructions

#### 24.1 — Upload Service

1. Create `server/src/services/upload.service.ts`:
   - Configure `multer`: storage destination (`UPLOAD_DIR`), file filter (images only: jpg, png, gif, webp, svg), size limit (`MAX_FILE_SIZE`)
   - `uploadSingle(fieldName)`: middleware for single file upload
   - `uploadMultiple(fieldName, maxCount)`: middleware for multiple files
   - `processUpload(file)`: save to disk → create MediaItem in DB → return `{ id, url, filename, mimeType, size }`
   - `deleteUpload(mediaId)`: delete file from disk → delete MediaItem from DB
   - `getMediaItems(filters)`: paginated media library query
   - URL generation: `/uploads/{filename}` (served as static files)

2. Create `server/src/routes/media.ts`:

   | Method | Path | Middleware | Description |
   |--------|------|-----------|-------------|
   | GET | `/api/media` | authenticate, requireAdmin | List media items (paginated, searchable) |
   | POST | `/api/media/upload` | authenticate, requireAdmin, uploadSingle('file') | Upload single file |
   | POST | `/api/media/upload-multiple` | authenticate, requireAdmin, uploadMultiple('files', 10) | Upload multiple |
   | DELETE | `/api/media/:id` | authenticate, requireAdmin | Delete media item |
   | GET | `/api/media/:id` | authenticate | Get media item details |

3. Mount in `app.ts` + serve static: `app.use('/uploads', express.static(env.UPLOAD_DIR))`.

#### 24.2 — Email Service

4. Create `server/src/services/email.service.ts`:
   - Configure `nodemailer` transport: if `SMTP_HOST` is set → use SMTP; otherwise → log to console (dev mode)
   - `sendEmail(to, subject, html)`: send via transport → log activity
   - `sendWelcomeEmail(user)`: use welcome template
   - `sendApplicationApproved(user)`: approval template with next steps
   - `sendApplicationRejected(user, reason)`: rejection template
   - `sendOrderConfirmation(user, order)`: order details template
   - `sendPasswordReset(user, resetUrl)`: reset link template
   - `sendTopUpConfirmation(user, amount)`: balance update template
   - All functions are fire-and-forget (don't await, log errors silently)

5. Create email templates in `server/src/templates/`:
   - Each template is a function that returns HTML string
   - Use the brand config from DB for brand name/colors in templates
   - Keep templates simple: inline styles, no external CSS
   - Each template exports a function: `(data: TemplateData) => string`

#### 24.3 — Wire Emails into Existing Services

6. Update auth service: call `sendWelcomeEmail` on register, `sendPasswordReset` on forgot-password
7. Update admin service: call `sendApplicationApproved`/`sendApplicationRejected` on approve/reject
8. Update commerce service: call `sendOrderConfirmation` on order creation
9. Update dropship service: call `sendTopUpConfirmation` on top-up confirmation

#### 24.4 — Verification

10. Test:
    - Upload file → file saved to disk → MediaItem in DB → URL accessible
    - Delete media → file removed → DB record removed
    - Register user → console shows welcome email HTML (dev mode)
    - Approve application → console shows approval email
    - If SMTP configured → actual email sent
    - `npx tsc --noEmit` — 0 errors

---

## Task 25 — Frontend-Backend Integration

**Goal**: Replace ALL mock frontend services with real API calls to the backend. This is the bridge between frontend and backend.

**Depends on**: Frontend Tasks 14–18, Backend Tasks 19–24
**Cannot be parallelized** — modifies many frontend files

### Files to Modify (Frontend)
```
src/services/auth.service.ts
src/services/orders.service.ts
src/services/invoices.service.ts
src/services/tracking.service.ts
src/services/support.service.ts
src/services/pricing.service.ts
src/services/ordering.service.ts
src/services/dashboard.service.ts
src/services/account.service.ts
src/services/dropship.service.ts        (if exists from Task 14)
src/services/admin.service.ts           (if exists from Task 15)
src/services/partners.service.ts        (if exists from Task 16)
src/services/pricing-admin.service.ts   (if exists from Task 16)
src/services/vendors.service.ts         (if exists from Task 16)
src/services/operations.service.ts      (if exists from Task 17)
src/contexts/AuthContext.tsx
src/contexts/BrandContext.tsx            (if exists from Task 16)
```

### Files to Create (Frontend)
```
src/lib/api-client.ts                   — Centralized fetch wrapper
.env.example                            — Frontend env vars
```

### Step-by-Step Instructions

#### 25.1 — API Client

1. Create `src/lib/api-client.ts`:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

   interface ApiOptions {
     method?: string;
     body?: unknown;
     headers?: Record<string, string>;
     params?: Record<string, string>;
   }

   class ApiClient {
     private getToken(): string | null {
       return localStorage.getItem('homatz_auth_token');
     }

     async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
       const { method = 'GET', body, headers = {}, params } = options;

       const url = new URL(`${API_BASE}${endpoint}`);
       if (params) {
         Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
       }

       const token = this.getToken();
       const config: RequestInit = {
         method,
         headers: {
           'Content-Type': 'application/json',
           ...(token && { Authorization: `Bearer ${token}` }),
           ...headers,
         },
         ...(body && { body: JSON.stringify(body) }),
       };

       const response = await fetch(url.toString(), config);
       const data = await response.json();

       if (!response.ok) {
         throw new ApiError(response.status, data.error || 'Request failed', data.details);
       }

       return data.data as T;
     }

     get<T>(endpoint: string, params?: Record<string, string>) {
       return this.request<T>(endpoint, { params });
     }

     post<T>(endpoint: string, body?: unknown) {
       return this.request<T>(endpoint, { method: 'POST', body });
     }

     put<T>(endpoint: string, body?: unknown) {
       return this.request<T>(endpoint, { method: 'PUT', body });
     }

     delete<T>(endpoint: string) {
       return this.request<T>(endpoint, { method: 'DELETE' });
     }

     async upload<T>(endpoint: string, formData: FormData): Promise<T> {
       const token = this.getToken();
       const response = await fetch(`${API_BASE}${endpoint}`, {
         method: 'POST',
         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
         body: formData,
       });
       const data = await response.json();
       if (!response.ok) throw new ApiError(response.status, data.error);
       return data.data as T;
     }
   }

   export const api = new ApiClient();
   ```

2. Create `.env.example` at project root:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

#### 25.2 — Replace Auth Service

3. Rewrite `src/services/auth.service.ts`:
   - `login(email, password)` → `api.post('/auth/login', { email, password })`
   - `register(data)` → `api.post('/auth/register', data)`
   - `getCurrentUser()` → `api.get('/auth/me')`
   - `forgotPassword(email)` → `api.post('/auth/forgot-password', { email })`
   - `resetPassword(token, password)` → `api.post('/auth/reset-password', { token, password, confirmPassword: password })`
   - `changePassword(current, newPass)` → `api.post('/auth/change-password', { currentPassword: current, newPassword: newPass, confirmPassword: newPass })`
   - `logout()` → `api.post('/auth/logout')` + clear localStorage

4. Update `src/contexts/AuthContext.tsx`:
   - On mount: if token exists in localStorage → call `getCurrentUser()` → set user state
   - `login`: call `authService.login()` → store token → set user
   - `register`: call `authService.register()` → store token → redirect based on status
   - Error handling: if 401 → clear token, set user null

#### 25.3 — Replace All Service Files

5. For each service file, replace mock data with API calls using `api` client. Pattern:

   **Before (mock):**
   ```typescript
   export async function getOrders() {
     return mockOrders;
   }
   ```

   **After (API):**
   ```typescript
   import { api } from '../lib/api-client';

   export async function getOrders(filters?: OrderFilters) {
     return api.get<OrderSummary[]>('/orders', filters as Record<string, string>);
   }
   ```

   Replace these services (in order):
   - `orders.service.ts` → `/api/orders`
   - `invoices.service.ts` → `/api/invoices`
   - `tracking.service.ts` → `/api/tracking`
   - `support.service.ts` → `/api/support`
   - `pricing.service.ts` → `/api/pricing`
   - `ordering.service.ts` → `/api/orders` (POST)
   - `dashboard.service.ts` → composite of `/api/orders` + `/api/support` stats
   - `account.service.ts` → `/api/auth/me` + `/api/auth/change-password`
   - `dropship.service.ts` → `/api/dropship`
   - `admin.service.ts` → `/api/categories`, `/api/products`, `/api/pages`, `/api/faq`, `/api/media`
   - `partners.service.ts` → `/api/admin/partners`
   - `pricing-admin.service.ts` → `/api/admin/pricing`
   - `vendors.service.ts` → `/api/admin/vendors`
   - `operations.service.ts` → `/api/admin/operations`

6. Update `BrandContext.tsx` (if exists):
   - Fetch brand config from `/api/admin/brand` on mount (for admin)
   - For public site: fetch from `/api/brand` (add a public brand endpoint if needed)

#### 25.4 — Error Handling in UI

7. Ensure every page that calls an API:
   - Has try/catch around service calls
   - Shows loading state while fetching
   - Shows error message if request fails (use `toast.error()`)
   - Handles 401 by redirecting to login

#### 25.5 — Proxy Configuration

8. Update `vite.config.ts` to proxy API requests in development:
   ```typescript
   export default defineConfig({
     // ...existing config
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:4000',
           changeOrigin: true,
         },
       },
     },
   });
   ```

#### 25.6 — Verification

9. Run both servers:
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Frontend
   npm run dev
   ```
10. Test complete flows:
    - Register → pending page
    - Login as approved wholesale → dashboard → orders → order detail
    - Login as dropship → dropship dashboard → top up flow
    - Login as admin → CMS pages → edit category → save
    - Admin: approve application → partner can now login
    - All pages load data from API (no mock data)
    - `npm run build` — 0 errors (frontend)
    - `cd server && npx tsc --noEmit` — 0 errors (backend)

---

## Task 26 — Backend QA & Deployment

**Goal**: Final backend audit, security hardening, API documentation, and deployment readiness.

**Depends on**: Task 25 (integration complete)

### Step-by-Step Instructions

#### 26.1 — Security Audit

1. **Rate limiting**: add `express-rate-limit` to sensitive endpoints:
   - `/api/auth/login` → 5 attempts per 15 min per IP
   - `/api/auth/register` → 3 per hour per IP
   - `/api/auth/forgot-password` → 3 per hour per IP
   - Global: 100 requests per minute per IP

2. **Input sanitization**: ensure Zod validation is on ALL POST/PUT routes (grep for any unvalidated route handlers).

3. **SQL injection**: Prisma parameterizes queries by default, but check for any raw SQL usage.

4. **Auth security**:
   - Verify password hashing uses bcrypt with 12+ rounds
   - Verify JWT expiry is set
   - Verify sensitive user fields (passwordHash) are never returned in API responses
   - Verify users can only access their own data (no IDOR vulnerabilities)

5. **CORS**: verify only `FRONTEND_URL` is allowed.

6. **Helmet**: add `helmet` middleware for security headers.

#### 26.2 — Error & Edge Case Audit

7. Test edge cases:
   - Create order with out-of-stock item → appropriate error
   - Dropship order when balance locked → 400 with clear message
   - Delete category with products → 400 "Category has products"
   - Register with existing email → 409 "Email already registered"
   - Access other user's order → 404 (not 403, to prevent enumeration)
   - Upload oversized file → 400 with size limit message
   - Upload non-image file → 400 with file type message

#### 26.3 — Database Indexes

8. Add indexes for frequently queried fields in `schema.prisma`:
   ```prisma
   @@index([userId, status])        // on Order
   @@index([userId, createdAt])     // on Transaction
   @@index([categoryId, status])    // on ProductFamily
   @@index([status, createdAt])     // on PartnerApplication
   @@index([actionType, createdAt]) // on ActivityLog
   ```
   Run `prisma migrate dev` to apply.

#### 26.4 — API Documentation

9. Create `server/docs/api-reference.md`:
   - List every endpoint: method, path, auth requirement, request body schema, response shape
   - Group by domain: Auth, Catalog, Commerce, Admin, Operations
   - Include example request/response for each endpoint
   - Document error codes and their meanings

#### 26.5 — Environment & Deployment

10. Create `server/Dockerfile`:
    ```dockerfile
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npx prisma generate
    RUN npm run build

    FROM node:20-alpine
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/prisma ./prisma
    EXPOSE 4000
    CMD ["node", "dist/server.js"]
    ```

11. Update `server/docker-compose.yml` to include the API service:
    ```yaml
    api:
      build: .
      ports:
        - "4000:4000"
      environment:
        - DATABASE_URL=postgresql://homatz:homatz_dev@postgres:5432/homatz_db
        - JWT_SECRET=${JWT_SECRET}
        - NODE_ENV=production
      depends_on:
        - postgres
    ```

12. Create `server/docs/deployment.md`:
    - Prerequisites: Node 20+, PostgreSQL 16+
    - Environment variables table with descriptions
    - Database setup: `prisma migrate deploy`
    - Seed: `npx tsx prisma/seed.ts`
    - Build: `npm run build`
    - Start: `npm start`
    - Docker: `docker compose up`
    - Health check: `GET /api/health`

#### 26.6 — Final Verification

13. Run:
    ```bash
    cd server
    npx tsc --noEmit          # 0 errors
    npm test                   # all tests pass
    npm run build              # builds successfully
    ```

14. Full integration test:
    ```bash
    docker compose up -d
    npx prisma migrate deploy
    npx tsx prisma/seed.ts
    npm start
    ```
    - Health check: `curl http://localhost:4000/api/health` → `{ status: "ok" }`
    - Login: `curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"admin123"}'` → returns token
    - Full frontend works with backend

---

## Agent Prompts — Quick Copy

These are ready-to-paste prompts for Claude Code. Each includes full context for autonomous execution.

### Wave 1 — Parallel (Task 14 + Task 15)

#### Agent A: Task 14 — Dropship

```
You are working on the HOMATZ B2B platform. Complete Task 14 — Dropship Balance & Ledger.

READ FIRST (before any changes):
- TASKS.md section "Task 14" for full step-by-step instructions
- CLAUDE.md for project rules
- src/types/commerce.ts, src/services/orders.service.ts (service pattern)
- src/layouts/PortalLayout.tsx, src/contexts/AuthContext.tsx
- src/app/components/guards/WholesaleGuard.tsx (mirror for DropshipGuard)
- src/app/routes.tsx

CREATE these files:
- src/services/dropship.service.ts — mock balance, transactions, top-up (follow orders.service.ts pattern)
- src/app/components/guards/DropshipGuard.tsx — mirror WholesaleGuard
- src/app/pages/portal/DropshipDashboardPage.tsx — balance display, trend chart (recharts), recent transactions
- src/app/pages/portal/DropshipLedgerPage.tsx — full transaction table with filters, pagination
- src/app/pages/portal/TopUpPage.tsx — preset amounts, bank transfer details, form
- src/app/pages/portal/BankTransferConfirmPage.tsx — confirmation + what happens next
- src/app/pages/portal/DropshipStatementPage.tsx — date range, generate/download

MODIFY these files:
- src/types/commerce.ts — add DropshipBalance, Transaction, TopUpRequest, BalanceThreshold types
- src/layouts/PortalLayout.tsx — add dropship sidebar section (only for dropship accounts), add low balance banner
- src/app/routes.tsx — register all /dashboard/dropship/* routes with DropshipGuard

DESIGN: Use shadcn/ui components (Card, Badge, Button, Table, Tabs, Dialog, Select, Input). Charts with recharts. Toast with sonner.

VERIFY: npm run build && npx tsc --noEmit — 0 errors. Wholesale users must NOT see dropship pages.
```

#### Agent B: Task 15 — Admin CMS

```
You are working on the HOMATZ B2B platform. Complete Task 15 — Admin Layout & Content CMS.

READ FIRST (before any changes):
- TASKS.md section "Task 15" for full step-by-step instructions
- CLAUDE.md for project rules
- src/layouts/PortalLayout.tsx (layout pattern reference)
- src/app/components/guards/AuthGuard.tsx (requireAdmin prop)
- src/lib/content-types.ts (CMS forms must produce these shapes)
- src/content/categories.ts, src/content/product-families.ts (data structure reference)
- src/app/routes.tsx

CREATE these files:
- src/layouts/AdminLayout.tsx — sidebar with sections (Content, Partners, Commerce, Platform, Operations), top bar, responsive
- src/services/admin.service.ts — CRUD for categories, products, pages, FAQ, media (mock in-memory store)
- src/app/pages/admin/CategoryListPage.tsx — table, search, add/edit/delete actions
- src/app/pages/admin/CategoryEditPage.tsx — tabbed form with all fields, react-hook-form, useFieldArray for dynamic lists, react-dnd for reordering
- src/app/pages/admin/ProductListPage.tsx — table with category filter
- src/app/pages/admin/ProductEditPage.tsx — tabbed form (Basic, Content, Gallery, Specs, Variants, Related, SEO)
- src/app/pages/admin/PagesListPage.tsx — table with status
- src/app/pages/admin/PageEditPage.tsx — simple form (title, slug, body, status, meta)
- src/app/pages/admin/FAQManagementPage.tsx — category tabs, drag-reorder, inline add/edit
- src/app/pages/admin/MediaLibraryPage.tsx — grid/list toggle, upload UI, copy URL, delete

MODIFY:
- src/app/routes.tsx — register all /admin/* routes with AuthGuard requireAdmin={true}

CMS forms MUST match the data interfaces in src/lib/content-types.ts. Use react-hook-form for all forms. Use shadcn/ui components. Use react-dnd for drag-reorder.

VERIFY: npm run build && npx tsc --noEmit — 0 errors. Non-admin users must NOT access /admin routes.
```

### Wave 2 — Parallel (Task 16 + Task 17)

#### Agent C: Task 16 — Admin Management

```
You are working on the HOMATZ B2B platform. Complete Task 16 — Admin Partners, Pricing, Vendors, Whitelabel.

READ FIRST:
- TASKS.md section "Task 16" for full step-by-step instructions
- CLAUDE.md for project rules
- src/layouts/AdminLayout.tsx, src/services/admin.service.ts
- src/types/auth.ts, src/types/commerce.ts, src/contexts/AuthContext.tsx
- src/app/App.tsx, src/app/components/Header.tsx, src/app/components/Footer.tsx
- src/app/routes.tsx

CREATE:
- src/services/partners.service.ts — partner applications + approved partners mock data & CRUD
- src/services/pricing-admin.service.ts — pricing rules, MOQ rules, bulk discount tiers
- src/services/vendors.service.ts — vendor CRUD with product family mapping
- src/contexts/BrandContext.tsx — BrandConfig interface, BrandProvider, useBrand() hook
- src/app/pages/admin/PartnerApplicationsPage.tsx — table, approve/reject with notes
- src/app/pages/admin/PartnerListPage.tsx — table, suspend/reactivate, order history
- src/app/pages/admin/RolesPermissionsPage.tsx — permissions matrix with checkboxes
- src/app/pages/admin/PricingAdminPage.tsx — 3 tabs: visibility toggles, MOQ rules, bulk discounts
- src/app/pages/admin/VendorsPage.tsx — table, CRUD dialog, product mapping
- src/app/pages/admin/BrandSettingsPage.tsx — brand identity, colors, email/document branding

MODIFY:
- src/app/App.tsx — wrap with BrandProvider (outside AuthProvider)
- src/app/components/Header.tsx — replace hardcoded "HOMATZ" with useBrand().brandName
- src/app/components/Footer.tsx — same, use useBrand()
- src/app/routes.tsx — register all new admin routes

VERIFY: npm run build && npx tsc --noEmit — 0 errors. Brand settings save should reflect in Header/Footer.
```

#### Agent D: Task 17 — Operations

```
You are working on the HOMATZ B2B platform. Complete Task 17 — Operations & Internal Management.

READ FIRST:
- TASKS.md section "Task 17" for full step-by-step instructions
- CLAUDE.md for project rules
- src/layouts/AdminLayout.tsx, src/services/orders.service.ts, src/services/support.service.ts
- src/types/orders.ts, src/types/support.ts
- src/app/routes.tsx

CREATE:
- src/services/operations.service.ts — OperationalOrder, ReturnRequest, ActivityLogEntry types + mock data (15-20 orders, 5-8 returns, 30+ log entries) + all CRUD functions
- src/app/pages/admin/OrderWorkflowPage.tsx — Kanban board (react-dnd drag between columns) + table view toggle, bulk status update, order detail Sheet with assign/notes
- src/app/pages/admin/OpsDashboardPage.tsx — stats cards, orders-by-status chart (recharts BarChart), activity feed, quick links
- src/app/pages/admin/ReturnsPage.tsx — table, create return dialog, status flow (Reported→Investigating→Resolved/Rejected), resolution actions, internal notes
- src/app/pages/admin/ActivityLogPage.tsx — filterable table, pagination, CSV export (Blob + download)
- src/app/pages/admin/AdminSupportPage.tsx — all tickets cross-partner, assign agent, internal notes (separate from thread), priority escalation, admin reply

MODIFY:
- src/app/routes.tsx — register all /admin/operations/* routes
- src/layouts/AdminLayout.tsx — ensure Operations section links match route paths

VERIFY: npm run build && npx tsc --noEmit — 0 errors. Kanban drag-drop must work. Charts must render.
```

### Wave 3 — Sequential (Task 18)

#### Agent E: Task 18 — Final QA

```
You are working on the HOMATZ B2B platform. Complete Task 18 — Final QA & Production Readiness.

READ FIRST:
- TASKS.md section "Task 18" for the full comprehensive audit checklist
- CLAUDE.md for project rules

This is a FULL PLATFORM AUDIT. Work through EVERY section:

1. VISUAL AUDIT: Check all public pages, auth pages, portal pages, admin pages for design consistency
2. LINK AUDIT: Test every navigation link, CTA, cross-reference, breadcrumb
3. ROUTE AUDIT: Verify 404 page exists, all auth redirects work correctly
4. CONTENT AUDIT: grep for "lorem|placeholder|TODO|FIXME|coming soon|TBD" — fix all
5. STATE AUDIT: Test auth flows (approved/pending/rejected), account type separation, form validation, loading/empty/error states
6. CODE QUALITY:
   - npx tsc --noEmit → fix ALL errors
   - Remove ALL console.log
   - Remove ALL `: any` types
   - Split components > 300 lines
   - Fix unused imports
7. DOCUMENTATION: Create docs/route-map.md and docs/test-credentials.md
8. FINAL BUILD: npm run build — 0 errors

Fix issues as you find them. Do not just report — FIX.
```

### Backend Wave 4 — Foundation

#### Agent F: Task 19 — Backend Foundation

```
You are building the backend for the HOMATZ B2B platform. Complete Task 19 — Backend Foundation & Database.

READ FIRST:
- TASKS.md section "Task 19" for full step-by-step instructions
- CLAUDE.md for project rules
- src/types/auth.ts, src/types/orders.ts, src/types/commerce.ts, src/types/support.ts (frontend types to match)
- src/services/*.ts (understand the mock data shapes you need to replicate in the database)

The backend lives in a NEW `server/` directory at project root. Do NOT modify any files in `src/`.

CREATE the entire server/ directory:
- package.json, tsconfig.json, .env.example, docker-compose.yml, nodemon.json
- prisma/schema.prisma — COMPLETE database schema (users, categories, products, orders, invoices, tracking, support, dropship, vendors, brand, activity log, returns, quotes — every table)
- prisma/seed.ts — realistic seed data matching frontend mock data
- src/app.ts — Express setup with middleware, CORS, health check
- src/server.ts — Entry point
- src/config/ — env loader, Prisma client singleton
- src/middleware/ — error handler, Zod validation, CORS
- src/utils/ — ApiError class, API response helpers, pagination, logger
- src/types/express.d.ts — Request augmentation

Stack: Express 5, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcryptjs, multer, nodemailer.

VERIFY:
- cd server && npm install && npx tsc --noEmit — 0 errors
- docker compose up -d (PostgreSQL starts)
- npx prisma db push && npx tsx prisma/seed.ts (schema applied, data seeded)
- npm run dev → server starts, GET /api/health returns { status: "ok" }
```

### Backend Wave 5 — Parallel (Tasks 20 + 21 + 22)

#### Agent G: Task 20 — Auth API

```
You are building the Auth API for the HOMATZ B2B platform. Complete Task 20 — Auth API & JWT.

READ FIRST:
- TASKS.md section "Task 20" for full step-by-step instructions
- server/prisma/schema.prisma (User, BusinessProfile, PartnerApplication models)
- server/src/app.ts, server/src/config/, server/src/middleware/, server/src/utils/
- src/types/auth.ts (frontend types for reference)
- src/services/auth.service.ts (frontend mock — understand expected behavior)

CREATE:
- server/src/middleware/auth.ts — JWT authenticate middleware, requireApproved, requireAdmin, requireAccountType
- server/src/validators/auth.validators.ts — Zod schemas for register, login, forgot-password, reset-password, change-password
- server/src/services/auth.service.ts — register (hash + create user + profile + application), login (verify + JWT), getCurrentUser, forgotPassword, resetPassword, changePassword
- server/src/routes/auth.ts — POST /register, POST /login, GET /me, POST /forgot-password, POST /reset-password, POST /change-password, POST /logout

MODIFY:
- server/src/app.ts — mount: app.use('/api/auth', authRoutes)

VERIFY:
- POST /api/auth/login with { email: "wholesale@test.com", password: "test123" } → returns JWT + user
- GET /api/auth/me with Bearer token → returns user profile
- POST /api/auth/register → creates user with PENDING status
- Invalid credentials → 401
- cd server && npx tsc --noEmit — 0 errors
```

#### Agent H: Task 21 — Content API

```
You are building the Content & Catalog API for the HOMATZ B2B platform. Complete Task 21 — Content & Catalog API.

READ FIRST:
- TASKS.md section "Task 21" for full step-by-step instructions
- server/prisma/schema.prisma (Category, Subcategory, ProductFamily, ProductVariant, ContentPage, FAQItem models)
- server/src/middleware/auth.ts (authenticate, requireAdmin)
- server/src/utils/ (ApiError, apiSuccess, apiPaginated, parsePagination)
- src/lib/content-types.ts (frontend content interfaces)

CREATE:
- server/src/services/catalog.service.ts — CRUD for categories (with subcategories), products (with variants), pages, FAQ
- server/src/validators/catalog.validators.ts — Zod schemas for category, product, page, FAQ
- server/src/routes/categories.ts — GET (public), POST/PUT/DELETE (admin)
- server/src/routes/products.ts — GET (public with filters/pagination), POST/PUT/DELETE (admin)
- server/src/routes/pages.ts — GET (public), POST/PUT/DELETE (admin)
- server/src/routes/faq.ts — GET (public), POST/PUT/DELETE/reorder (admin)

MODIFY:
- server/src/app.ts — mount all routes under /api/categories, /api/products, /api/pages, /api/faq

Public endpoints return only published items. Admin endpoints require authenticate + requireAdmin.

VERIFY:
- GET /api/categories → returns all published categories
- GET /api/categories/kitchen-household → returns category with subcategories
- GET /api/products?category=kitchen-household → filtered products
- Admin: POST /api/categories with JWT → creates category
- Non-admin on admin routes → 403
- cd server && npx tsc --noEmit — 0 errors
```

#### Agent I: Task 22 — Commerce API

```
You are building the Partner & Commerce API for the HOMATZ B2B platform. Complete Task 22 — Partner & Commerce API.

READ FIRST:
- TASKS.md section "Task 22" for full step-by-step instructions
- server/prisma/schema.prisma (Order, OrderItem, Invoice, TrackingInfo, SupportTicket, PriceListItem, DropshipBalance, Transaction models)
- server/src/middleware/auth.ts (authenticate, requireApproved, requireAccountType)
- src/types/orders.ts, src/types/commerce.ts, src/types/support.ts (frontend types)
- src/services/orders.service.ts, src/services/dropship.service.ts (mock behavior reference)

CREATE:
- server/src/services/commerce.service.ts — orders CRUD, invoices, tracking, pricing visibility, quote requests
- server/src/services/dropship.service.ts — balance, transactions, top-up, threshold check, balance history, statements
- server/src/services/support.service.ts — tickets CRUD, messages, close
- server/src/validators/commerce.validators.ts — Zod schemas for orders, top-ups, tickets, quotes
- server/src/routes/orders.ts — GET list, GET detail, POST create, POST cancel, POST reorder
- server/src/routes/invoices.ts — GET list, GET detail, GET download
- server/src/routes/tracking.ts — GET active shipments, GET by order
- server/src/routes/support.ts — GET list, GET detail, POST create, POST message, POST close
- server/src/routes/pricing.ts — GET price-list, GET moq-rules, GET bulk-discounts, POST quote-request
- server/src/routes/dropship.ts — GET balance, GET transactions, POST topup, GET balance-history, GET statement

MODIFY:
- server/src/app.ts — mount all routes

All routes require authenticate + requireApproved. Dropship routes also require requireAccountType('DROPSHIP'). Users can only access their own data.

VERIFY:
- Wholesale user: GET /api/pricing/price-list → returns visible items
- Dropship user: GET /api/dropship/balance → returns balance
- POST /api/orders → creates order
- POST /api/support → creates ticket
- Wholesale on /api/dropship/balance → 403
- cd server && npx tsc --noEmit — 0 errors
```

### Backend Wave 6 — Parallel (Tasks 23 + 24)

#### Agent J: Task 23 — Admin API

```
You are building the Admin & Operations API for the HOMATZ B2B platform. Complete Task 23 — Admin & Operations API.

READ FIRST:
- TASKS.md section "Task 23" for full step-by-step instructions
- server/prisma/schema.prisma (all models)
- server/src/middleware/auth.ts (authenticate, requireAdmin)
- server/src/services/ (existing services for reference)

CREATE:
- server/src/services/admin.service.ts — partner applications (approve/reject), partner management (suspend/reactivate), pricing rules CRUD, vendor CRUD, brand config
- server/src/services/operations.service.ts — order workflow (status change, assign, internal notes, bulk update), returns CRUD, activity log, ops stats, admin support (all tickets, assign, internal notes, escalate, reply)
- server/src/validators/admin.validators.ts — Zod schemas for all admin inputs
- server/src/routes/admin/partners.ts — applications list/approve/reject, partners list/suspend/reactivate
- server/src/routes/admin/pricing.ts — pricing rules, MOQ rules, bulk discount tiers CRUD
- server/src/routes/admin/vendors.ts — vendor CRUD
- server/src/routes/admin/brand.ts — GET/PUT brand config
- server/src/routes/admin/operations.ts — order workflow, returns, activity log (with CSV export), ops stats
- server/src/routes/admin/support.ts — all tickets, assign, internal notes, priority, reply, close/reopen
- server/src/routes/admin/topups.ts — list pending, confirm/reject

MODIFY:
- server/src/app.ts — mount all under /api/admin/*

ALL routes require authenticate + requireAdmin. Every state change logs to ActivityLog.

VERIFY:
- Admin: approve application → user status changes, activity logged
- Admin: update order status → timeline entry + activity log
- Admin: confirm top-up → balance increases + transaction created
- Non-admin → 403 on all admin routes
- cd server && npx tsc --noEmit — 0 errors
```

#### Agent K: Task 24 — Uploads & Email

```
You are building File Upload & Email services for the HOMATZ B2B platform. Complete Task 24 — File Uploads & Email.

READ FIRST:
- TASKS.md section "Task 24" for full step-by-step instructions
- server/prisma/schema.prisma (MediaItem model)
- server/src/app.ts (where to mount routes + static serving)
- server/src/config/env.ts (UPLOAD_DIR, MAX_FILE_SIZE, SMTP_* vars)

CREATE:
- server/src/services/upload.service.ts — multer config (images only, size limit), processUpload (save + DB), deleteUpload, getMediaItems
- server/src/services/email.service.ts — nodemailer transport (SMTP or console fallback), sendWelcomeEmail, sendApplicationApproved/Rejected, sendOrderConfirmation, sendPasswordReset, sendTopUpConfirmation
- server/src/routes/media.ts — GET list, POST upload single/multiple, DELETE item (admin only)
- server/src/templates/ — HTML email template functions (welcome, approved, rejected, order-confirmation, password-reset)
- server/uploads/.gitkeep

MODIFY:
- server/src/app.ts — mount /api/media routes, serve static /uploads directory
- server/.gitignore — add uploads/* !uploads/.gitkeep
- server/src/services/auth.service.ts — call sendWelcomeEmail on register, sendPasswordReset on forgot-password
- server/src/services/admin.service.ts — call sendApplicationApproved/Rejected on approve/reject

In dev mode (no SMTP), emails log to console. File uploads save to disk + create MediaItem record.

VERIFY:
- POST /api/media/upload with image file → file saved, DB record created, URL accessible
- DELETE /api/media/:id → file deleted, DB record deleted
- Register → console shows welcome email HTML
- Upload non-image → 400
- Upload oversized file → 400
- cd server && npx tsc --noEmit — 0 errors
```

### Backend Wave 7 — Sequential (Tasks 25 + 26)

#### Agent L: Task 25 — Frontend-Backend Integration

```
You are integrating the HOMATZ frontend with the backend API. Complete Task 25 — Frontend-Backend Integration.

READ FIRST:
- TASKS.md section "Task 25" for full step-by-step instructions
- All files in src/services/ (current mock implementations)
- src/contexts/AuthContext.tsx, src/contexts/BrandContext.tsx
- server/src/routes/ (all API endpoints available)

CREATE:
- src/lib/api-client.ts — centralized fetch wrapper with JWT auth, error handling, typed methods (get/post/put/delete/upload)
- .env.example — VITE_API_URL=http://localhost:4000/api

MODIFY (replace mock data with API calls in EVERY service file):
- src/services/auth.service.ts → /api/auth/*
- src/services/orders.service.ts → /api/orders
- src/services/invoices.service.ts → /api/invoices
- src/services/tracking.service.ts → /api/tracking
- src/services/support.service.ts → /api/support
- src/services/pricing.service.ts → /api/pricing
- src/services/ordering.service.ts → /api/orders (POST)
- src/services/dashboard.service.ts → composite API calls
- src/services/account.service.ts → /api/auth/me + /api/auth/change-password
- src/services/dropship.service.ts → /api/dropship
- src/services/admin.service.ts → /api/categories + /api/products + /api/pages + /api/faq + /api/media
- src/services/partners.service.ts → /api/admin/partners
- src/services/pricing-admin.service.ts → /api/admin/pricing
- src/services/vendors.service.ts → /api/admin/vendors
- src/services/operations.service.ts → /api/admin/operations
- src/contexts/AuthContext.tsx — use API for login/register/getCurrentUser
- src/contexts/BrandContext.tsx — fetch from /api/admin/brand
- vite.config.ts — add proxy: { '/api': { target: 'http://localhost:4000' } }

Keep the same function signatures so page components don't need changes. Only the service internals change.

VERIFY:
- Both servers running (frontend :5173, backend :4000)
- Login → dashboard → orders → all data from API
- Admin → CMS → save category → persisted in DB
- Register → pending → admin approves → user can login
- npm run build — 0 errors (frontend)
- cd server && npx tsc --noEmit — 0 errors (backend)
```

#### Agent M: Task 26 — Backend QA

```
You are doing the final Backend QA for the HOMATZ B2B platform. Complete Task 26 — Backend QA & Deployment.

READ FIRST:
- TASKS.md section "Task 26" for full step-by-step instructions
- server/src/ — entire backend codebase

This is a comprehensive backend audit:

1. SECURITY:
   - Add express-rate-limit (login: 5/15min, register: 3/hr, global: 100/min)
   - Add helmet middleware
   - Verify Zod validation on ALL POST/PUT routes
   - Verify passwords never returned in API responses
   - Verify users can only access own data (no IDOR)
   - Verify CORS allows only FRONTEND_URL

2. EDGE CASES: Test and fix:
   - Order with out-of-stock → error
   - Dropship order when locked → 400
   - Delete category with products → 400
   - Duplicate email registration → 409
   - Access other user's order → 404
   - Oversized/wrong-type file upload → 400

3. DATABASE: Add indexes to schema.prisma for frequently queried fields, run migration

4. DOCUMENTATION:
   - Create server/docs/api-reference.md (every endpoint, request/response shapes, auth requirements)
   - Create server/docs/deployment.md (setup steps, env vars, Docker, health check)

5. DEPLOYMENT:
   - Create server/Dockerfile (multi-stage build)
   - Update docker-compose.yml to include api service

6. FINAL: cd server && npx tsc --noEmit — 0 errors, npm test — passes, npm run build — succeeds
```

---

## Rules Reminder

Apply these to EVERY task:

1. **Read before edit** — always read a file before modifying it
2. **Reuse before create** — `grep -r "ComponentName" src/` before building new components
3. **No hardcoded brand** — use BrandContext/config for brand name, colors, logo
4. **Content in TS files** — never hardcode product/category data in JSX
5. **Slug-based routing** — dynamic `:slug` params, not one-off route files
6. **Design language** — white/neutral BGs, dark grey type, yellow accents, spacious sections
7. **No `any` types** — use proper TypeScript interfaces
8. **No `console.log`** — remove before finishing
9. **Components < 300 lines** — split if larger
10. **No unused imports** — clean up after refactoring
11. **Build must pass** — `npm run build` and `npx tsc --noEmit` with 0 errors after every task
12. **Don't touch locked pages** — Homepage, Kitchen & Household, Stock Pot are baseline-locked
13. **Use shadcn/ui** — always use existing UI primitives from `src/app/components/ui/`
14. **Use existing services pattern** — study `orders.service.ts` before creating new services
15. **Use existing guard pattern** — study `WholesaleGuard.tsx` before creating new guards





