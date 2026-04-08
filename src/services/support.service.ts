import { SupportTicket, TicketCategory, TicketMessage, TicketStatus } from '../types/support';
import { api } from '../lib/api-client';

export const supportService = {
  async list(): Promise<SupportTicket[]> {
    return api.get<SupportTicket[]>('/support');
  },

  async get(id: string): Promise<SupportTicket | null> {
    return api.get<SupportTicket>(`/support/${id}`);
  },

  async create(data: {
    subject: string;
    category: TicketCategory;
    relatedOrderNumber?: string;
    description: string;
  }): Promise<SupportTicket> {
    return api.post<SupportTicket>('/support', data);
  },

  async reply(ticketId: string, body: string): Promise<TicketMessage> {
    return api.post<TicketMessage>(`/support/${ticketId}/messages`, { body });
  },

  async close(ticketId: string): Promise<void> {
    await api.post(`/support/${ticketId}/close`);
  },

  async updateStatus(ticketId: string, status: TicketStatus): Promise<void> {
    if (status === 'Closed') {
      await api.post(`/admin/support/${ticketId}/close`);
    } else if (status === 'Open') {
      await api.post(`/admin/support/${ticketId}/reopen`);
    }
  },
};
