import { SupportTicket, TicketCategory, TicketMessage, TicketStatus } from '../types/support';
import { api } from '../lib/api-client';

interface RawTicketMessage {
  id: string;
  author: string;
  authorName: string;
  body: string;
  createdAt: string;
}

interface RawTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  relatedOrderId?: string | null;
  createdAt: string;
  messages?: RawTicketMessage[];
}

function normalizeMessage(raw: RawTicketMessage): TicketMessage {
  return {
    id: raw.id,
    author: raw.author,
    authorName: raw.authorName,
    body: raw.body,
    createdAt: raw.createdAt,
  };
}

function normalizeTicket(raw: RawTicket): SupportTicket {
  return {
    id: raw.id,
    ticketNumber: raw.ticketNumber,
    subject: raw.subject,
    category: raw.category as TicketCategory,
    status: raw.status as TicketStatus,
    priority: raw.priority as SupportTicket['priority'],
    relatedOrderId: raw.relatedOrderId ?? null,
    createdAt: raw.createdAt,
    messages: (raw.messages ?? []).map(normalizeMessage),
  };
}

export const supportService = {
  async list(): Promise<SupportTicket[]> {
    const raw = await api.get<RawTicket[]>('/support');
    return raw.map(normalizeTicket);
  },

  async get(id: string): Promise<SupportTicket | null> {
    const raw = await api.get<RawTicket>(`/support/${id}`);
    return raw ? normalizeTicket(raw) : null;
  },

  async create(data: {
    subject: string;
    category: TicketCategory;
    relatedOrderId?: string;
    description: string;
  }): Promise<SupportTicket> {
    const raw = await api.post<RawTicket>('/support', data);
    return normalizeTicket(raw);
  },

  async reply(ticketId: string, body: string): Promise<TicketMessage> {
    const raw = await api.post<RawTicketMessage>(`/support/${ticketId}/messages`, { body });
    return normalizeMessage(raw);
  },

  async close(ticketId: string): Promise<void> {
    await api.post(`/support/${ticketId}/close`);
  },

  async updateStatus(ticketId: string, status: TicketStatus): Promise<void> {
    if (status === 'CLOSED') {
      await api.post(`/admin/support/${ticketId}/close`);
    } else if (status === 'OPEN') {
      await api.post(`/admin/support/${ticketId}/reopen`);
    }
  },
};