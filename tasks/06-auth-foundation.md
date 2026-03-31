# Task 6 — Auth State Model & Context

Set up the authentication/authorization foundation before building auth UI.

## Steps

1. Create `src/types/auth.ts`:
   - `AccountType` enum: `WHOLESALE | DROPSHIP`
   - `ApprovalStatus` enum: `PENDING | APPROVED | REJECTED | SUSPENDED`
   - `User` interface: id, email, companyName, accountType, approvalStatus, role (`partner | admin`)
   - `AuthState` interface: isAuthenticated, user (nullable), loading

2. Create `src/contexts/AuthContext.tsx`:
   - Provide `AuthState` + actions: `login`, `logout`, `register` (async, mock implementations)
   - Store state in React state (localStorage persistence for mock — easy to swap for API later)
   - Export `useAuth()` hook

3. Create `src/components/guards/AuthGuard.tsx`:
   - Wraps children
   - If not authenticated → redirect to `/login`
   - If authenticated but PENDING → redirect to `/apply/pending`
   - If authenticated but REJECTED → redirect to `/apply/restricted`
   - If APPROVED → render children
   - Prop: `requireAdmin?: boolean` — if true, also check `role === 'admin'`

4. Wrap the app with `AuthProvider` in the root component.

5. Create `src/services/auth.service.ts`:
   - Mock implementations for login, register, logout, getCurrentUser
   - Typed request/response interfaces
   - Easy to replace with real API calls later

6. `npm run build` — 0 errors. No UI changes yet, just the foundation.
