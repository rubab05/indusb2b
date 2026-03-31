# Task 7 — Auth UI Pages

Build the registration, login, and approval state pages. Uses the auth foundation from Task 6.

## Steps

### Registration
1. `/apply` — B2B access landing page. Explains wholesale vs dropship models. CTAs to each application form.
2. `/apply/wholesale` — Wholesale application form: company name, reg number, address, contacts, business type, revenue range, categories of interest, terms checkbox. Validates all fields. On submit → redirect to `/apply/pending`.
3. `/apply/dropship` — Dropship application form: same base fields plus website URL, platform (Shopify/WooCommerce/etc.), estimated monthly volume. Validates. On submit → redirect to `/apply/pending`.

### Login
4. `/login` — Email + password. Remember me. Forgot password link. "Don't have an account? Apply" link. On login → redirect based on approval status (APPROVED → `/dashboard`, PENDING → `/apply/pending`, REJECTED → `/apply/restricted`).
5. `/forgot-password` — Email input → success message.
6. `/reset-password` — New password + confirm + strength indicator → redirect to `/login`.

### Approval States
7. `/apply/pending` — Thank you, reference number, timeline, what-happens-next, contact support link.
8. `/apply/restricted` — Status message, reason if available, contact support, re-apply option.

### Wiring
9. Add all routes. Auth pages redirect away if already logged in.
10. Protected routes (everything under `/dashboard`) wrapped with `AuthGuard`.
11. All forms use the auth service from Task 6.
12. All pages match approved design language.
13. `npm run build` — 0 errors.
