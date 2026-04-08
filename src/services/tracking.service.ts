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
  trackingUrl: string;
  status: ShipmentStatus;
  eta: string;
  events: TrackingEvent[];
}

export const trackingService = {
  async listActive(): Promise<Shipment[]> {
    return api.get<Shipment[]>('/tracking');
  },

  async getAll(): Promise<Shipment[]> {
    return api.get<Shipment[]>('/tracking');
  },

  async getByOrderId(orderId: string): Promise<Shipment | null> {
    return api.get<Shipment>(`/tracking/order/${orderId}`);
  },
};
