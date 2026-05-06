import { OrderLineInput, QuoteRequest } from '../types/commerce';
import { api } from '../lib/api-client';

export const orderingService = {
  async submitBulkOrder(
    lines: OrderLineInput[],
    shippingAddress: {
      name: string;
      company: string;
      line1: string;
      city: string;
      postcode: string;
      country: string;
    },
    notes: string
  ): Promise<string> {
    const order = await api.post<{ orderNumber: string }>('/orders', {
      items: lines.map((line) => ({
        productFamilyId: line.item.productFamilyId,
        productSlug: line.item.productSlug,
        productName: line.item.productName,
        sku: line.item.sku || line.item.productSlug,
        quantity: line.qty,
        unitPrice: line.item.unitPrice,
      })),
      shippingAddress,
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
