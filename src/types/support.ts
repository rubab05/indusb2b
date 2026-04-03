export type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";
export type TicketCategory = "Order Issue" | "Product Query" | "Account" | "Billing" | "Other";

export interface TicketMessage {
  id: string;
  author: "partner" | "support";
  authorName: string;
  body: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  relatedOrderNumber?: string;
  createdDate: string;
  messages: TicketMessage[];
}
