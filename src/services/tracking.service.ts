export type ShipmentStatus = "Dispatched" | "In Transit" | "Out for Delivery" | "Delivered";

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

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "shp-001",
    orderId: "ord-001",
    orderNumber: "ORD-2026-0041",
    carrier: "DPD",
    trackingNumber: "DPD1234567890",
    trackingUrl: "#",
    status: "In Transit",
    eta: "3 Apr 2026",
    events: [
      { label: "Dispatched", date: "31 Mar 2026", location: "HOMATZ Warehouse, Birmingham" },
      { label: "In Transit", date: "1 Apr 2026", location: "DPD Hub, Coventry" },
    ],
  },
  {
    id: "shp-002",
    orderId: "ord-002",
    orderNumber: "ORD-2026-0038",
    carrier: "Evri",
    trackingNumber: "EVR9876543210",
    trackingUrl: "#",
    status: "Delivered",
    eta: "27 Mar 2026",
    events: [
      { label: "Dispatched", date: "26 Mar 2026", location: "HOMATZ Warehouse, Birmingham" },
      { label: "In Transit", date: "26 Mar 2026", location: "Evri Depot, Leicester" },
      { label: "Out for Delivery", date: "27 Mar 2026", location: "Local Delivery Hub" },
      { label: "Delivered", date: "27 Mar 2026", location: "Manchester, M1 4AB" },
    ],
  },
  {
    id: "shp-003",
    orderId: "ord-003",
    orderNumber: "ORD-2026-0031",
    carrier: "Palletways",
    trackingNumber: "PLW20260318",
    trackingUrl: "#",
    status: "Delivered",
    eta: "22 Mar 2026",
    events: [
      { label: "Dispatched", date: "21 Mar 2026", location: "HOMATZ Warehouse, Birmingham" },
      { label: "In Transit", date: "21 Mar 2026", location: "Palletways Hub, Wolverhampton" },
      { label: "Out for Delivery", date: "22 Mar 2026", location: "Local Pallet Depot" },
      { label: "Delivered", date: "22 Mar 2026", location: "Manchester, M1 4AB" },
    ],
  },
];

const ACTIVE_STATUSES: ShipmentStatus[] = ["Dispatched", "In Transit", "Out for Delivery"];

export const trackingService = {
  async listActive(): Promise<Shipment[]> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_SHIPMENTS.filter((s) => ACTIVE_STATUSES.includes(s.status));
  },

  async getAll(): Promise<Shipment[]> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_SHIPMENTS;
  },

  async getByOrderId(orderId: string): Promise<Shipment | null> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_SHIPMENTS.find((s) => s.orderId === orderId) ?? null;
  },
};
