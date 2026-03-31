# HOMATZ Project Context

## 1. Project Overview

This project is a **complete React-based B2B wholesale and dropshipping platform** for **HOMATZ**.

It is **not** a standard retail ecommerce site and it is **not** just a frontend catalogue build.

It must be delivered as a **complete platform**, including:
- a public-facing B2B website
- category and product-family pages
- business registration and partner access flows
- wholesale and dropship account logic
- protected pricing visibility
- ordering and account-management flows
- support and tracking flows
- CMS/admin capabilities
- operational workflows
- a structure that can support whitelabel / multi-brand rollout if required

The goal is to deliver the **whole project**, not only the public storefront.

---

## 2. Delivery Goal

The expected outcome is a production-ready B2B platform for HOMATZ that supports the full business flow from discovery to trade access, ordering, account handling, support, content management, and internal administration.

This means the project must cover:

### Public-facing side
- homepage
- category pages
- product-family pages
- B2B access application pages
- login and approval-state pages
- catalogue and price-list access flows
- about / FAQ / policy / support-facing pages

### Partner-facing side
- wholesale and dropship onboarding
- account dashboard
- orders
- invoices / receipts
- tracking
- support requests
- pricing visibility after approval
- business account management

### Business workflow side
- MOQ and bulk-order workflows
- dropship ledger / balance logic
- top-up flow
- account approval flow
- status handling
- support escalation and context capture

### Admin / management side
- CMS for categories, products, and content pages
- partner approval and role handling
- pricing visibility rules
- vendor/product management
- whitelabel / branding controls
- internal operations and order workflow visibility

This project should be approached as a **complete B2B product**, not as a partial website.

---

## 3. Current State of the Project

The project already has an approved React baseline for the public-facing design system.

The following pages already exist and are approved as the visual and structural baseline:

- Homepage
- One category page: **Kitchen & Household**
- One product-family page: **Stock Pot 4.5L / 24cm**

These pages define the approved:
- layout
- spacing
- typography
- color system
- card treatment
- CTA styling
- section rhythm
- header
- footer
- overall design language

These pages are the baseline for all remaining public-facing pages, but the project itself must go beyond them and deliver the full platform.

---

## 4. Brand Context

HOMATZ is positioned as a multi-category household products supplier.

Core brand line:
**We develop and source high quality household products, specifically focused on everyday house items.**

The public-facing product universe currently spans:
- Mats & Rugs
- Decoration & Seasonal Products
- Kitchen & Household
- Garden & Outdoor
- Toys & Games

The brand direction is:
- practical
- everyday-use
- category-led
- trade-friendly
- broad retail and reseller appeal

---

## 5. Full Platform Scope

This platform has multiple layers and all of them are part of the required delivery.

## 5.1 Public B2B website
The public site must:
- present the HOMATZ brand
- showcase categories and product families
- explain the wholesale / dropship model
- direct businesses into onboarding
- support trade enquiry
- support controlled catalogue and pricing access
- establish trust and platform credibility

## 5.2 Partner onboarding and access
The platform must support:
- business registration
- wholesale application
- dropship application
- approval pending states
- access granted / denied states
- partner login
- password recovery
- post-approval access to pricing and tools

## 5.3 Wholesale workflow
The platform must support:
- MOQ logic
- category or product-based wholesale pricing visibility
- bulk ordering
- downloadable price lists
- quote requests
- order submission and tracking

## 5.4 Dropship workflow
The platform must support:
- dropship-specific access
- balance / ledger model
- top-up handling
- threshold logic
- transaction visibility
- dropship order logic and partner view

## 5.5 Partner account area
The partner portal must support:
- dashboard
- orders
- order detail
- invoices / receipts
- tracking
- support requests
- account settings
- business profile details

## 5.6 CMS / admin
The platform must include admin-facing capability for:
- content pages
- product families
- categories
- media/images
- pricing visibility rules
- partner approval and role control
- vendor data handling
- policy / FAQ page management
- internal content updates

## 5.7 Operations / internal management
The platform must support operational visibility such as:
- order status management
- fulfilment / workflow tracking
- notes / logs
- inventory-related states if needed
- returns / issue handling
- internal process visibility

## 5.8 Whitelabel / multi-brand readiness
The architecture should support brand-level flexibility such as:
- brand name
- logo
- colours
- text labels
- email / document branding
- domain-level variation

This does not mean this is “later work.” It means the project should be delivered with an architecture that can handle it cleanly.

---

## 6. Approved Frontend Direction

The approved public-facing frontend already establishes the visual system and should continue to guide all public pages.

### Homepage
The homepage already includes:
- category-led navigation and merchandising
- B2B application CTAs
- wholesale vs dropship messaging
- pricing visibility after approval messaging
- platform process explanation
- platform benefits
- About HOMATZ
- trade enquiry CTA sections

### Category page
The approved Kitchen & Household category page already includes:
- breadcrumbs
- category hero
- category intro
- trade utility strip
- subcategory grid
- featured product families
- category benefits
- best sellers
- trade CTA strip
- related categories

### Product-family page
The approved Stock Pot page already includes:
- breadcrumbs
- product image gallery
- summary / selectors / CTA panel
- trade-first CTAs
- pricing visibility note
- MOQ / bulk note
- long-form product content
- specification table
- variant cards
- commonly bought with
- enquiry form
- support block
- related categories

These are approved patterns, not temporary mockups.

---

## 7. Design Language That Must Be Preserved

The approved pages establish the visual baseline for the public-facing side.

Current design language includes:
- white / light neutral backgrounds
- dark grey typography
- restrained yellow accents for B2B emphasis
- wide desktop layouts
- spacious sections
- clean grids
- strong product/category cards
- professional, trade-oriented CTA styling
- reusable section composition

Any new public-facing pages should inherit this visual system.

---

## 8. Content Architecture Status

The project content has **already been moved into structured TypeScript content files**.

This is important.

The project should no longer depend on raw source documents or scattered hardcoded content in JSX for category/product content.

The structured content system now exists and should be treated as the core rendering source for the relevant public-facing pages.

### Structured content files
- `src/lib/content-types.ts`
- `src/content/site-content.ts`
- `src/content/categories.ts`
- `src/content/product-families.ts`
- `src/content/navigation.ts`
- `src/lib/content-helpers.ts`

### Raw source reference
- `docs/homatz-master-content.docx`

The DOCX is still the source reference, but the structured TS files are now the working content layer.

### Content split
#### Shared site content
Stored in:
- `src/content/site-content.ts`

Used for:
- homepage messaging
- platform process
- benefits
- about/trade content
- shared public content

#### Category content
Stored in:
- `src/content/categories.ts`

Used for:
- category hero
- intros
- subcategories
- featured families
- best sellers
- benefits
- related categories
- CTA strips

#### Product-family content
Stored in:
- `src/content/product-families.ts`

Used for:
- product titles
- summaries
- galleries
- features
- use cases
- variants
- specifications
- related products
- related categories
- support blocks

#### Navigation content
Stored in:
- `src/content/navigation.ts`

Used for:
- top-level navigation
- category structure
- future menu expansion

---

## 9. Architecture Direction

The project should be built in a way that supports full delivery, maintainability, and admin/content control.

The recommended frontend/content architecture is:
- reusable templates
- structured content
- shared components
- route-driven rendering
- flexible section blocks
- admin/CMS-compatible schemas

### Preferred public-page model
The public-facing side should move toward:
- reusable `CategoryPage.tsx`
- reusable `ProductPage.tsx`

These should render using:
- slug-based routing
- structured content
- optional content blocks

This is not a limitation.
This is the correct way to build the public-facing system so it can scale and stay manageable.

### Important note
This does **not** mean the project is “only frontend.”
It means the public-facing side should be built properly as part of the full platform.

---

## 10. Existing Component Baseline

The current approved pages already imply a reusable component system.

### Shared/common components already in use
- `Header`
- `Footer`
- `Breadcrumbs`
- `CategoryCard`
- `ProductCard`
- `ProductCarousel`

### Category-oriented components
- `SubcategoryCard`
- `FeaturedProductCard`
- `ImageWithFallback`

### Product-oriented components
- `ProductImageGallery`
- `SpecTable`
- `EnquiryForm`
- `VariantCard`

These existing components should be preserved and extended where possible.

---

## 11. Full Delivery Workflow

The workflow for this project should cover the whole platform, not just public page generation.

### Phase 1 — Stabilize approved baseline
- confirm homepage, Kitchen category page, and Stock Pot page as the baseline
- verify routes, layout, and shared components
- ensure current public pages are wired cleanly

### Phase 2 — Complete public-facing catalogue layer
Build all remaining:
- category pages
- product-family pages
- support-facing informational pages
- trade-facing access pages

### Phase 3 — Build business access flows
Build:
- wholesale application
- dropship application
- login
- password reset
- approval pending / access states

### Phase 4 — Build partner portal
Build:
- dashboard
- orders
- invoices / receipts
- tracking
- support requests
- account/profile pages

### Phase 5 — Build pricing / order utility flows
Build:
- price list access/download pages
- quote / bulk ordering
- MOQ support states
- dropship top-up / balance screens

### Phase 6 — Build CMS / admin tools
Build:
- category management
- product-family management
- content page management
- partner approval management
- pricing visibility rules
- vendor/admin utilities

### Phase 7 — Build operations / management screens
Build:
- order status tracking
- internal workflow visibility
- support/issue tracking
- operational status pages

### Phase 8 — Final consistency and readiness
- visual consistency pass
- data/content consistency pass
- admin/content workflow check
- full-platform QA

---

## 12. Page Inventory Still To Be Built

### Public-facing category pages
- Mats & Rugs
- Decoration & Seasonal Products
- Garden & Outdoor
- Toys & Games

### Public-facing product-family pages
#### Mats & Rugs
- Barrier Mats
- Shaggy Rugs
- Chindi Rag Rugs
- Hallway Runner Rugs

#### Decoration & Seasonal
- Wax Burners
- Christmas Candle Bridges
- Artificial Christmas Trees
- Pencil Slim Christmas Trees

#### Garden & Outdoor
- Bamboo Fence Screening
- Bamboo Canes
- Green Garden Sticks
- Wooden Garden Stakes
- Artificial Hedge Screening
- Gazing Balls

#### Toys & Games
- Hula Hoops

### Public/business access pages
- Apply for B2B Access
- Apply as Wholesale Partner
- Apply as Dropship Partner
- Login
- Forgot Password / Reset Password
- Approval Pending
- Access Restricted / Awaiting Approval

### Partner portal pages
- Dashboard
- Orders
- Order Detail
- Invoices / Receipts
- Tracking
- Support Requests
- Support Request Detail
- Account Settings / Business Profile

### Wholesale workflow pages
- Bulk Order Page
- Quick Order / Multi-SKU Order
- Wholesale Price List Page
- MOQ / Ordering Rules Page

### Dropship workflow pages
- Dropship Dashboard
- Balance / Ledger
- Top-up Funds
- Bank Transfer Confirmation
- Low Balance / Threshold Lock State
- Balance Statement

### CMS / admin / content pages
- Product / category CMS screens
- FAQ page editor
- Policy page editor
- Pricing visibility management
- Partner approval screens
- Vendor mapping / content controls
- Whitelabel settings screens

### Operations / internal pages
- Order workflow board
- Operational status dashboard
- Returns / issue handling
- Notes / accountability logs
- Internal brand selector / management screens

---

## 13. Rules of Engagement

When working on this project, always follow these rules:

- treat it as a full-platform delivery
- do not think of it as just frontend extension work
- preserve the approved baseline where relevant
- inspect before changing
- reuse before creating
- do not redesign approved pages unnecessarily
- keep structured content files as the working source of truth
- do not hardcode reusable category/product content into page JSX
- keep routes scalable
- keep templates flexible
- keep architecture maintainable
- make minimal unnecessary visual changes
- maintain coherence between public, partner, and admin sides

---

## 14. CMS / Admin Compatibility

Although the project content is already structured in TS files right now, the architecture should remain compatible with admin/CMS usage because the project includes content and management requirements.

That means:
- content should stay separate from layout
- slugs should stay stable
- field naming should stay clean
- optional sections should remain supported
- page templates should consume structured data cleanly

The current TS content structure should be treated as the platform’s working content layer until or unless a stronger admin-backed content entry flow replaces it.

---

## 15. Final Summary

This project is a **complete HOMATZ B2B wholesale and dropshipping platform**, not just a public website and not just a frontend exercise.

It already has:
- an approved public-facing baseline in React
- a category-led browsing system
- a B2B-oriented product-family page model
- structured TypeScript content files already in place

It still needs:
- the rest of the public catalogue pages
- the full access/onboarding flow
- the partner portal
- pricing/order workflows
- support and tracking flows
- CMS/admin capabilities
- internal operational workflows

The implementation must continue in a way that:
- preserves the approved design baseline
- uses the structured TS content system already created
- supports the full delivery of the platform
- remains maintainable and scalable across public, partner, and admin layers