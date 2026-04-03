import { SupportTicket, TicketCategory, TicketMessage, TicketStatus } from "../types/support";

let MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tkt-001",
    ticketNumber: "TKT-2026-0012",
    subject: "Missing item in order ORD-2026-0031",
    category: "Order Issue",
    status: "Resolved",
    priority: "High",
    relatedOrderNumber: "ORD-2026-0031",
    createdDate: "19 Mar 2026",
    messages: [
      {
        id: "m1",
        author: "partner",
        authorName: "James Patel",
        body: "Hi, I received order ORD-2026-0031 but the Hallway Runner Rugs (HR-6024-BG) were missing from the delivery. Could you please investigate and arrange a re-dispatch?",
        timestamp: "19 Mar 2026, 09:14",
      },
      {
        id: "m2",
        author: "support",
        authorName: "HOMATZ Support",
        body: "Hi James, apologies for the inconvenience. I've checked the dispatch records and it looks like that line was accidentally omitted from the pallet. I've raised a re-dispatch for the 12 units and you should receive them within 2–3 working days. I'll send a tracking reference shortly.",
        timestamp: "19 Mar 2026, 11:02",
      },
      {
        id: "m3",
        author: "partner",
        authorName: "James Patel",
        body: "Thank you for sorting that quickly. Received the tracking reference — all good.",
        timestamp: "19 Mar 2026, 11:45",
      },
      {
        id: "m4",
        author: "support",
        authorName: "HOMATZ Support",
        body: "Great, glad we could resolve this. I'll mark the ticket as resolved. Don't hesitate to reach out if you need anything else.",
        timestamp: "19 Mar 2026, 12:00",
      },
    ],
  },
  {
    id: "tkt-002",
    ticketNumber: "TKT-2026-0019",
    subject: "Query on MOQ for Bamboo Canes",
    category: "Product Query",
    status: "Closed",
    priority: "Normal",
    createdDate: "22 Mar 2026",
    messages: [
      {
        id: "m1",
        author: "partner",
        authorName: "James Patel",
        body: "Can you confirm the MOQ for the Bamboo Canes 90cm bundles? I'd like to order a mixed pallet with garden stakes but want to check minimum quantities first.",
        timestamp: "22 Mar 2026, 14:30",
      },
      {
        id: "m2",
        author: "support",
        authorName: "HOMATZ Support",
        body: "Hi James, the MOQ for BC-90-B10 is 24 bundles. Garden stakes (WGS-90-5PK) have an MOQ of 20 packs. Both can be combined on the same order — there's no pallet minimum as long as each line meets its individual MOQ. Let me know if you need a quote.",
        timestamp: "22 Mar 2026, 15:10",
      },
      {
        id: "m3",
        author: "partner",
        authorName: "James Patel",
        body: "Perfect, that's exactly what I needed. Thanks!",
        timestamp: "22 Mar 2026, 15:22",
      },
    ],
  },
  {
    id: "tkt-003",
    ticketNumber: "TKT-2026-0024",
    subject: "Invoice INV-2026-0018 — payment query",
    category: "Billing",
    status: "InProgress",
    priority: "High",
    createdDate: "28 Mar 2026",
    messages: [
      {
        id: "m1",
        author: "partner",
        authorName: "James Patel",
        body: "Hi, I notice INV-2026-0018 is showing as Overdue but I sent a bank transfer on 3 Apr. I've attached the remittance advice. Could you confirm receipt and update the status?",
        timestamp: "28 Mar 2026, 10:05",
      },
      {
        id: "m2",
        author: "support",
        authorName: "HOMATZ Support",
        body: "Thanks James, I've passed this to our accounts team and they're checking the incoming payments now. We'll update you within 24 hours.",
        timestamp: "28 Mar 2026, 10:30",
      },
    ],
  },
];

let nextId = 4;

export const supportService = {
  async list(): Promise<SupportTicket[]> {
    await new Promise((r) => setTimeout(r, 400));
    return [...MOCK_TICKETS].reverse();
  },

  async get(id: string): Promise<SupportTicket | null> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_TICKETS.find((t) => t.id === id) ?? null;
  },

  async create(data: {
    subject: string;
    category: TicketCategory;
    relatedOrderNumber?: string;
    description: string;
  }): Promise<SupportTicket> {
    await new Promise((r) => setTimeout(r, 600));
    const ticket: SupportTicket = {
      id: `tkt-00${nextId}`,
      ticketNumber: `TKT-2026-00${20 + nextId}`,
      subject: data.subject,
      category: data.category,
      status: "Open",
      priority: "Normal",
      relatedOrderNumber: data.relatedOrderNumber || undefined,
      createdDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      messages: [
        {
          id: "m1",
          author: "partner",
          authorName: "You",
          body: data.description,
          timestamp: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    MOCK_TICKETS.push(ticket);
    nextId++;
    return ticket;
  },

  async reply(ticketId: string, body: string): Promise<TicketMessage> {
    await new Promise((r) => setTimeout(r, 400));
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    const msg: TicketMessage = {
      id: `m${ticket.messages.length + 1}`,
      author: "partner",
      authorName: "You",
      body,
      timestamp: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    ticket.messages.push(msg);
    if (ticket.status === "Resolved" || ticket.status === "Closed") {
      ticket.status = "Open";
    }
    return msg;
  },

  async close(ticketId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (ticket) ticket.status = "Closed";
  },

  async updateStatus(ticketId: string, status: TicketStatus): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (ticket) ticket.status = status;
  },
};
