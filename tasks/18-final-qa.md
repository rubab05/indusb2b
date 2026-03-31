# Task 18 — Final QA & Production Readiness

Complete platform-wide audit. Every page, every link, every state.

## Steps

### Visual Consistency
1. Visit every public page (homepage, all 5 categories, all 16 product families, all static pages).
2. Visit every auth page (apply, login, forgot password, pending, restricted).
3. Visit every portal page (dashboard, orders, invoices, tracking, support, account, dropship pages).
4. Visit every admin page (all CMS, partners, pricing, vendors, brand, all operations).
5. On each page check: correct colours, consistent typography, consistent spacing, consistent cards/buttons, responsive at 1440/1024/768/375px. Fix any deviation.

### Link & Route Audit
6. Test every link in Header nav, Footer, Breadcrumbs, sidebar navs (portal + admin).
7. Test every CTA button, card click-through, form submission redirect.
8. Test all internal cross-references (order detail → invoice, dashboard → orders, etc.).
9. Confirm a 404 page exists and renders for unknown routes.
10. Confirm auth redirects: unauthenticated → login, pending → pending page, rejected → restricted, admin routes → blocked for non-admin.

### Content Audit
11. Grep the entire codebase for placeholder text: `grep -ri "lorem\|placeholder\|TODO\|FIXME\|coming soon" src/`
12. Fix or remove all instances.
13. Verify every category and product family has complete real content.
14. Verify all static pages have real content.

### State & Data Audit
15. Verify AuthContext works: login as wholesale → see wholesale pages, login as dropship → see dropship pages, login as admin → see admin.
16. Verify BrandContext provides values and components consume them.
17. Verify all mock services have realistic data and typed interfaces.
18. Verify all forms validate correctly (submit empty, submit invalid, submit valid).
19. Verify all loading and error states render.

### Code Quality
20. Run `npx tsc --noEmit` — fix all errors.
21. Run linter if configured — fix all warnings.
22. `grep -r "console\.log" src/` — remove all.
23. `grep -r ": any" src/` — replace all `any` types with proper types.
24. Check no component exceeds 300 lines: `find src -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 300 ] && echo "$1: $lines lines"' _ {} \;`
25. Check for unused imports: build output usually flags these.

### Build & Documentation
26. `npm run build` — must complete with 0 errors, 0 warnings.
27. Serve the production build locally and spot-check 10 pages.
28. Update `README.md` with:
   - Project overview (what HOMATZ is)
   - Setup: `npm install && npm run dev`
   - Environment variables needed (list with descriptions, even if mock for now)
   - Folder structure summary
   - Full route map (public, auth, portal, admin)
   - Mock user credentials for testing
   - Notes on API-ready service layer

## Output
Project is production-ready for backend integration.
