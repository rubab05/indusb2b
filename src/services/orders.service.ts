import { Order, OrderSummary } from '../types/orders';
import { api } from '../lib/api-client';

export const ordersService = {
  async list(): Promise<OrderSummary[]> {
    return api.get<OrderSummary[]>('/orders');
  },

  async get(id: string): Promise<Order | null> {
    return api.get<Order>(`/orders/${id}`);
  },

  async cancel(id: string): Promise<Order> {
    return api.post<Order>(`/orders/${id}/cancel`);
  },

  async reorder(id: string): Promise<Order> {
    return api.post<Order>(`/orders/${id}/reorder`);
  },
};
