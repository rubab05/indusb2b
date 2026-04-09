import { api } from '../lib/api-client';

export type ShipmentStatus = 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface TrackingEvent {
  label: ShipmentStatus;
  date: string;
  location?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: ShipmentStatus;
  eta: string | null;
  events: TrackingEvent[];
}

// Backend returns TrackingInfo with nested order
interface RawTracking {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
  createdAt: string;
  order?: {
    orderNumber?: string;
    status?: string;
    timeline?: Array<{ status: string; date: string; note?: string | null }>;
  };
}

const ORDER_STATUS_TO_SHIPMENT: Record<string, ShipmentStatus> = {
  PROCESSING: 'Dispatched',
  PACKED: 'Dispatched',
  SHIPPED: 'In Transit',
  DELIVERED: 'Delivered',
};

function normalizeShipment(raw: RawTracking): Shipment {
  const orderStatus = raw.order?.status ?? 'SHIPPED';
  const status: ShipmentStatus = ORDER_STATUS_TO_SHIPMENT[orderStatus] ?? 'In Transit';

  const events: TrackingEvent[] = (raw.order?.timeline ?? []).map((t) => ({
    label: (ORDER_STATUS_TO_SHIPMENT[t.status] ?? 'In Transit') as ShipmentStatus,
    date: t.date,
  }));

  return {
    id: raw.id,
    orderId: raw.orderId,
    orderNumber: raw.order?.orderNumber ?? raw.orderId,
    carrier: raw.carrier,
    trackingNumber: raw.trackingNumber,
    trackingUrl: raw.trackingUrl ?? null,
    status,
    eta: raw.estimatedDelivery ?? null,
    events,
  };
}

export const trackingService = {
  async listActive(): Promise<Shipment[]> {
    const raw = await api.get<RawTracking[]>('/tracking');
    return raw.map(normalizeShipment);
  },

  async getAll(): Promise<Shipment[]> {
    const raw = await api.get<RawTracking[]>('/tracking');
    return raw.map(normalizeShipment);
  },

  async getByOrderId(orderId: string): Promise<Shipment | null> {
    const raw = await api.get<RawTracking>(`/tracking/order/${orderId}`);
    return raw ? normalizeShipment(raw) : null;
  },
};