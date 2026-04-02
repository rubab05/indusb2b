import { Order, OrderStatus, OrderSummary } from "../types/orders";

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "ORD-2026-0041",
    date: "28 Mar 2026",
    status: "Shipped",
    items: [
      { id: "i1", productName: "Stock Pot 4.5L 24cm", sku: "SP-4524-SS", qty: 12, unitPrice: 18.5, lineTotal: 222.0 },
      { id: "i2", productName: "Barrier Mat 60x90cm — Red", sku: "BM-6090-RD", qty: 24, unitPrice: 6.25, lineTotal: 150.0 },
      { id: "i3", productName: "Chindi Rag Rug 60x90cm", sku: "CR-6090-MX", qty: 36, unitPrice: 4.95, lineTotal: 178.2 },
      { id: "i4", productName: "Hula Hoop 70cm — Assorted", sku: "HH-70-ASS", qty: 60, unitPrice: 1.15, lineTotal: 69.0 },
    ],
    subtotal: 619.2,
    shippingCost: 0,
    total: 619.2,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "DPD", trackingNumber: "DPD1234567890", trackingUrl: "#", estimatedDelivery: "2 Apr 2026" },
    timeline: [
      { status: "Order Placed", date: "28 Mar 2026" },
      { status: "Payment Confirmed", date: "28 Mar 2026" },
      { status: "Processing", date: "29 Mar 2026" },
      { status: "Shipped", date: "31 Mar 2026", note: "Dispatched via DPD" },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "ORD-2026-0038",
    date: "24 Mar 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Wax Burner — Geometric White", sku: "WB-GEO-WH", qty: 24, unitPrice: 4.5, lineTotal: 108.0 },
      { id: "i2", productName: "Shaggy Rug 120x170cm — Grey", sku: "SH-1217-GY", qty: 6, unitPrice: 22.0, lineTotal: 132.0 },
    ],
    subtotal: 240.0,
    shippingCost: 0,
    total: 240.0,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "Evri", trackingNumber: "EVR9876543210", trackingUrl: "#", estimatedDelivery: "27 Mar 2026" },
    timeline: [
      { status: "Order Placed", date: "24 Mar 2026" },
      { status: "Payment Confirmed", date: "24 Mar 2026" },
      { status: "Processing", date: "25 Mar 2026" },
      { status: "Shipped", date: "26 Mar 2026" },
      { status: "Delivered", date: "27 Mar 2026" },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "ORD-2026-0031",
    date: "18 Mar 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Bamboo Fence Screening 1mx4m", sku: "BF-1x4-NT", qty: 20, unitPrice: 12.5, lineTotal: 250.0 },
      { id: "i2", productName: "Bamboo Canes 90cm (Bundle 10)", sku: "BC-90-B10", qty: 50, unitPrice: 3.2, lineTotal: 160.0 },
      { id: "i3", productName: "Gazing Ball 20cm — Silver", sku: "GB-20-SL", qty: 30, unitPrice: 5.75, lineTotal: 172.5 },
      { id: "i4", productName: "Artificial Christmas Tree 6ft", sku: "ACT-6FT-GN", qty: 15, unitPrice: 18.0, lineTotal: 270.0 },
      { id: "i5", productName: "Christmas Candle Bridge 7-arm", sku: "CCB-7A-NT", qty: 24, unitPrice: 7.25, lineTotal: 174.0 },
      { id: "i6", productName: "Hallway Runner Rug 60x240cm", sku: "HR-6024-BG", qty: 12, unitPrice: 14.5, lineTotal: 174.0 },
      { id: "i7", productName: "Green Garden Stakes 90cm (10pk)", sku: "GS-90-GN10", qty: 60, unitPrice: 1.65, lineTotal: 99.0 },
    ],
    subtotal: 1299.5,
    shippingCost: 0,
    total: 1299.5,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "Palletways", trackingNumber: "PLW20260318", trackingUrl: "#", estimatedDelivery: "22 Mar 2026" },
    timeline: [
      { status: "Order Placed", date: "18 Mar 2026" },
      { status: "Payment Confirmed", date: "18 Mar 2026" },
      { status: "Processing", date: "19 Mar 2026" },
      { status: "Shipped", date: "21 Mar 2026", note: "Pallet delivery — Palletways" },
      { status: "Delivered", date: "22 Mar 2026" },
    ],
  },
  {
    id: "ord-004",
    orderNumber: "ORD-2026-0029",
    date: "15 Mar 2026",
    status: "Cancelled",
    items: [
      { id: "i1", productName: "Pencil Slim Christmas Tree 5ft", sku: "PCT-5FT-GN", qty: 10, unitPrice: 14.0, lineTotal: 140.0 },
    ],
    subtotal: 140.0,
    shippingCost: 0,
    total: 140.0,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    timeline: [
      { status: "Order Placed", date: "15 Mar 2026" },
      { status: "Cancelled", date: "15 Mar 2026", note: "Cancelled by partner — out of season" },
    ],
  },
  {
    id: "ord-005",
    orderNumber: "ORD-2026-0022",
    date: "10 Mar 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Barrier Mat 40x60cm — Black", sku: "BM-4060-BK", qty: 48, unitPrice: 3.75, lineTotal: 180.0 },
      { id: "i2", productName: "Wax Burner — Round Ceramic", sku: "WB-RND-CR", qty: 36, unitPrice: 3.95, lineTotal: 142.2 },
      { id: "i3", productName: "Artificial Hedge Screening 1mx1m", sku: "AHS-1x1-GN", qty: 30, unitPrice: 8.5, lineTotal: 255.0 },
      { id: "i4", productName: "Stock Pot 9L 28cm", sku: "SP-9028-SS", qty: 12, unitPrice: 24.5, lineTotal: 294.0 },
      { id: "i5", productName: "Hula Hoop 56cm — Assorted", sku: "HH-56-ASS", qty: 120, unitPrice: 0.95, lineTotal: 114.0 },
    ],
    subtotal: 985.2,
    shippingCost: 0,
    total: 985.2,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "DPD", trackingNumber: "DPD0000222000", trackingUrl: "#", estimatedDelivery: "13 Mar 2026" },
    timeline: [
      { status: "Order Placed", date: "10 Mar 2026" },
      { status: "Payment Confirmed", date: "10 Mar 2026" },
      { status: "Processing", date: "11 Mar 2026" },
      { status: "Shipped", date: "12 Mar 2026" },
      { status: "Delivered", date: "13 Mar 2026" },
    ],
  },
  {
    id: "ord-006",
    orderNumber: "ORD-2026-0018",
    date: "5 Mar 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Chindi Rag Rug 80x150cm", sku: "CR-8015-MX", qty: 20, unitPrice: 8.5, lineTotal: 170.0 },
      { id: "i2", productName: "Gazing Ball 30cm — Copper", sku: "GB-30-CU", qty: 15, unitPrice: 9.5, lineTotal: 142.5 },
    ],
    subtotal: 312.5,
    shippingCost: 0,
    total: 312.5,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "Evri", trackingNumber: "EVR1111222333", trackingUrl: "#", estimatedDelivery: "8 Mar 2026" },
    timeline: [
      { status: "Order Placed", date: "5 Mar 2026" },
      { status: "Payment Confirmed", date: "5 Mar 2026" },
      { status: "Processing", date: "6 Mar 2026" },
      { status: "Shipped", date: "7 Mar 2026" },
      { status: "Delivered", date: "8 Mar 2026" },
    ],
  },
  {
    id: "ord-007",
    orderNumber: "ORD-2026-0011",
    date: "20 Feb 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Bamboo Fence Screening 1mx3m", sku: "BF-1x3-NT", qty: 30, unitPrice: 9.75, lineTotal: 292.5 },
      { id: "i2", productName: "Wooden Garden Stakes 90cm (5pk)", sku: "WGS-90-5PK", qty: 40, unitPrice: 2.5, lineTotal: 100.0 },
      { id: "i3", productName: "Shaggy Rug 80x150cm — Cream", sku: "SH-8015-CR", qty: 10, unitPrice: 16.0, lineTotal: 160.0 },
    ],
    subtotal: 552.5,
    shippingCost: 0,
    total: 552.5,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "DPD", trackingNumber: "DPD0007777000", trackingUrl: "#", estimatedDelivery: "24 Feb 2026" },
    timeline: [
      { status: "Order Placed", date: "20 Feb 2026" },
      { status: "Payment Confirmed", date: "20 Feb 2026" },
      { status: "Processing", date: "21 Feb 2026" },
      { status: "Shipped", date: "23 Feb 2026" },
      { status: "Delivered", date: "24 Feb 2026" },
    ],
  },
  {
    id: "ord-008",
    orderNumber: "ORD-2026-0005",
    date: "8 Feb 2026",
    status: "Delivered",
    items: [
      { id: "i1", productName: "Stock Pot 4.5L 24cm", sku: "SP-4524-SS", qty: 24, unitPrice: 18.5, lineTotal: 444.0 },
      { id: "i2", productName: "Wax Burner — Geometric White", sku: "WB-GEO-WH", qty: 48, unitPrice: 4.5, lineTotal: 216.0 },
    ],
    subtotal: 660.0,
    shippingCost: 0,
    total: 660.0,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    tracking: { carrier: "Evri", trackingNumber: "EVR9990001111", trackingUrl: "#", estimatedDelivery: "12 Feb 2026" },
    timeline: [
      { status: "Order Placed", date: "8 Feb 2026" },
      { status: "Payment Confirmed", date: "8 Feb 2026" },
      { status: "Processing", date: "9 Feb 2026" },
      { status: "Shipped", date: "11 Feb 2026" },
      { status: "Delivered", date: "12 Feb 2026" },
    ],
  },
  {
    id: "ord-009",
    orderNumber: "ORD-2026-0042",
    date: "30 Mar 2026",
    status: "Pending",
    items: [
      { id: "i1", productName: "Barrier Mat 60x90cm — Black", sku: "BM-6090-BK", qty: 48, unitPrice: 6.25, lineTotal: 300.0 },
    ],
    subtotal: 300.0,
    shippingCost: 0,
    total: 300.0,
    shippingAddress: { name: "James Patel", company: "Demo Wholesale Ltd", line1: "14 Trade Park Way", city: "Manchester", postcode: "M1 4AB", country: "United Kingdom" },
    timeline: [
      { status: "Order Placed", date: "30 Mar 2026" },
      { status: "Payment Confirmed", date: "30 Mar 2026" },
    ],
  },
];

function toSummary(o: Order): OrderSummary {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    date: o.date,
    itemCount: o.items.reduce((sum, i) => sum + i.qty, 0),
    total: o.total,
    status: o.status,
  };
}

export const ordersService = {
  async list(): Promise<OrderSummary[]> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_ORDERS.map(toSummary);
  },

  async get(id: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_ORDERS.find((o) => o.id === id) ?? null;
  },
};
