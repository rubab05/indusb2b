# Task 17 — Operations & Internal Management

Build internal operational visibility and workflow tools under the admin panel.

## Steps

### Order Workflow
1. `/admin/operations/orders` — Order management:
   - Toggle: Kanban board vs table view
   - Kanban columns: New → Processing → Packed → Shipped → Delivered
   - Drag to change status (or status dropdown in table view)
   - Click → order detail with full context
   - Assign to team member dropdown
   - Internal notes field (not visible to partner)
   - Bulk status update (select multiple → change status)

### Ops Dashboard
2. `/admin/operations/dashboard` — Operations overview:
   - Orders by status (bar/pie chart)
   - Pending fulfilment count
   - Average fulfilment time stat
   - Open/overdue support tickets count
   - Recent activity feed (last 20 actions)

### Returns & Issues
3. `/admin/operations/returns` — Returns list:
   - Table: Return #, Order #, Partner, Reason, Status, Date
   - Create new return/issue
   - Status flow: Reported → Investigating → Resolved / Rejected
   - Link to original order
   - Internal notes, resolution action (refund/replacement/credit)

### Activity Log
4. `/admin/operations/logs` — Accountability log:
   - Table of all significant actions: order changes, approvals, content edits, pricing changes, returns
   - Filter by action type, user, date range
   - Export as CSV

### Internal Support
5. `/admin/operations/support` — All support tickets (cross-partner):
   - Filter by status, priority, category, partner
   - Assign to agent
   - Internal notes (not visible to partner)
   - Priority escalation toggle
   - Reply from admin view

### Verify
6. All operations pages admin-only.
7. `npm run build` — 0 errors.
