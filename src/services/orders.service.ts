import { Order, OrderItem, OrderSummary, OrderStatus, TimelineEvent, TrackingInfo } from '../types/orders';
import { api } from '../lib/api-client';

// Raw shapes returned by the backend (Prisma serialises Decimal as string)
interface RawOrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
}

interface RawTimeline {
  id?: string;
  status: string;
  date: string;
  note?: string | null;
}

interface RawTracking {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
}

interface RawOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  subtotal: string | number;
  shippingCost: string | number;
  total: string | number;
  shippingAddress: Record<string, unknown>;
  items: RawOrderItem[];
  timeline?: RawTimeline[];
  tracking?: RawTracking | null;
}

function toNum(v: string | number | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return typeof v === 'number' ? v : parseFloat(v) || 0;
}

function normalizeItem(raw: RawOrderItem): OrderItem {
  return {
    id: raw.id,
    productName: raw.productName,
    sku: raw.sku,
    quantity: raw.quantity,
    unitPrice: toNum(raw.unitPrice),
    lineTotal: toNum(raw.lineTotal),
  };
}

function normalizeOrder(raw: RawOrder): Order {
  const tracking: TrackingInfo | null = raw.tracking
    ? {
        carrier: raw.tracking.carrier,
        trackingNumber: raw.tracking.trackingNumber,
        trackingUrl: raw.tracking.trackingUrl ?? null,
        estimatedDelivery: raw.tracking.estimatedDelivery ?? null,
      }
    : null;

  const timeline: TimelineEvent[] = (raw.timeline ?? []).map((t) => ({
    status: t.status,
    date: t.date,
    note: t.note ?? undefined,
  }));

  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    createdAt: raw.createdAt,
    status: raw.status as OrderStatus,
    items: raw.items.map(normalizeItem),
    subtotal: toNum(raw.subtotal),
    shippingCost: toNum(raw.shippingCost),
    total: toNum(raw.total),
    shippingAddress: raw.shippingAddress as Order['shippingAddress'],
    tracking,
    timeline,
  };
}

function normalizeOrderSummary(raw: RawOrder): OrderSummary {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    createdAt: raw.createdAt,
    status: raw.status as OrderStatus,
    items: raw.items.map(normalizeItem),
    total: toNum(raw.total),
  };
}

export const ordersService = {
  async list(): Promise<OrderSummary[]> {
    const raw = await api.get<RawOrder[]>('/orders');
    return raw.map(normalizeOrderSummary);
  },

  async get(id: string): Promise<Order | null> {
    const raw = await api.get<RawOrder>(`/orders/${id}`);
    return raw ? normalizeOrder(raw) : null;
  },

  async cancel(id: string): Promise<Order> {
    const raw = await api.post<RawOrder>(`/orders/${id}/cancel`);
    return normalizeOrder(raw);
  },

  async reorder(id: string): Promise<Order> {
    const raw = await api.post<RawOrder>(`/orders/${id}/reorder`);
    return normalizeOrder(raw);
  },
};