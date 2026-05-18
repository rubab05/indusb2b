import { AdminQuoteRequest } from '../types/commerce';
import { api } from '../lib/api-client';

function normalizeQuote(raw: any): AdminQuoteRequest {
  return {
    id: raw.id,
    referenceNumber: raw.referenceNumber,
    userId: raw.userId,
    lines: Array.isArray(raw.lines) ? raw.lines : [],
    specialRequirements: raw.specialRequirements ?? null,
    status: raw.status === 'responded' ? 'responded' : 'pending',
    adminResponse: raw.adminResponse ?? null,
    respondedAt: raw.respondedAt ?? null,
    respondedBy: raw.respondedBy ?? null,
    createdAt: raw.createdAt,
    partner: raw.partner ?? null,
  };
}

async function getAllQuotes(): Promise<AdminQuoteRequest[]> {
  const data = await api.get<any[]>('/admin/quotes');
  return Array.isArray(data) ? data.map(normalizeQuote) : [];
}

async function respondToQuote(id: string, response: string): Promise<AdminQuoteRequest> {
  const data = await api.post<any>(`/admin/quotes/${id}/respond`, { response });
  return normalizeQuote(data);
}

export const quotesAdminService = { getAllQuotes, respondToQuote };
