export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShippingAddress {
  name: string;
  company: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
}

export interface TimelineEvent {
  status: string;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  tracking?: TrackingInfo;
  timeline: TimelineEvent[];
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
}
