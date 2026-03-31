# Task 12 — Portal: Account Settings

Build the account and business profile management page.

## Steps

1. Create `src/services/account.service.ts`: typed interfaces, mock profile data.
2. `/dashboard/account` — Account settings page with sections:
   - **Business Profile**: company name, registration number, address, phone, website — edit/save per section
   - **Contact Details**: primary contact name, email, phone — edit/save
   - **Login & Security**: change password form (current + new + confirm), email notification toggles
   - **Documents**: list of uploaded business docs (view only, upload UI placeholder for API)
3. Each section has an Edit button → inline editing → Save/Cancel.
4. Form validation on all editable fields.
5. Success/error feedback on save.
6. `npm run build` — 0 errors.
