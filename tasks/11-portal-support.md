# Task 11 — Portal: Support

Build the support ticket system for partners.

## Steps

1. Create `src/types/support.ts`: SupportTicket, TicketMessage, TicketStatus (Open/InProgress/Resolved/Closed), TicketPriority, TicketCategory.
2. Create `src/services/support.service.ts`: typed interfaces, mock tickets with message threads.
3. `/dashboard/support` — Tickets list:
   - Table: Ticket #, Subject, Category, Status badge, Priority, Created date
   - Filter by status
   - "New Support Request" button
   - Empty state
4. `/dashboard/support/new` — New ticket form:
   - Subject input
   - Category dropdown (Order Issue, Product Query, Account, Billing, Other)
   - Related Order # (optional, with search/lookup)
   - Description textarea
   - File attachment UI (visual only, API-ready)
   - Submit → redirect to ticket detail
5. `/dashboard/support/:ticketId` — Ticket detail:
   - Ticket info header (subject, status, priority, created date)
   - Message thread (alternating user/support messages with timestamps)
   - Reply textarea + submit
   - Close ticket button (if open)
6. `npm run build` — 0 errors.
