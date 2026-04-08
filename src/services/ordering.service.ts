import { OrderLineInput, QuoteRequest } from '../types/commerce';
import { api } from '../lib/api-client';

export const orderingService = {
  async submitBulkOrder(lines: OrderLineInput[], address: string, notes: string): Promise<string> {
    const order = await api.post<{ orderNumber: string }>('/orders', {
      lines,
      shippingAddress: address,
      notes,
    });
    return order.orderNumber;
  },

  async submitQuickOrder(lines: OrderLineInput[], notes: string): Promise<string> {
    const order = await api.post<{ orderNumber: string }>('/orders', {
      lines,
      notes,
    });
    return order.orderNumber;
  },

  async submitQuoteRequest(data: {
    lines: Array<{ sku: string; productName: string; qty: number }>;
    specialRequirements: string;
  }): Promise<QuoteRequest> {
    return api.post<QuoteRequest>('/pricing/quote-request', data);
  },
};
