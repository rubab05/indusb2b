// ─── Types ────────────────────────────────────────────────────────────────────

export type OpsOrderStatus = "NEW" | "PROCESSING" | "PACKED" | "SHIPPED" | "DELIVERED";

export interface OperationalOrder {
  id: string;
  orderNumber: string;
  partnerName: string;
  partnerType: "WHOLESALE" | "DROPSHIP";
  items: { name: string; qty: number; sku: string }[];
  total: number;
  status: OpsOrderStatus;
  assignedTo: string | null;
  internalNotes: { text: string; user: string; date: string }[];
  createdDate: string;
  updatedDate: string;
  statusHistory: { status: string; date: string; user: string }[];
}

export type ReturnStatus = "REPORTED" | "INVESTIGATING" | "RESOLVED" | "REJECTED";
export type ResolutionType = "REFUND" | "REPLACEMENT" | "CREDIT" | "REJECTED";
export type ReturnReason = "DAMAGED" | "WRONG_ITEM" | "MISSING_ITEM" | "QUALITY_ISSUE" | "OTHER";

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  partnerName: string;
  reason: ReturnReason;
  description: string;
  status: ReturnStatus;
  resolution?: { type: ResolutionType; notes: string; date: string };
  internalNotes: { text: string; user: string; date: string }[];
  createdDate: string;
  updatedDate: string;
}

export type ActivityActionType =
  | "ORDER_UPDATE"
  | "APPROVAL"
  | "CONTENT_EDIT"
  | "PRICING_CHANGE"
  | "RETURN"
  | "LOGIN";

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  actionType: ActivityActionType;
  description: string;
  entityType?: string;
  entityId?: string;
}

export interface OpsStats {
  pendingFulfilment: number;
  avgFulfilmentDays: number;
  openSupportTickets: number;
  overdueSupportTickets: number;
  ordersByStatus: { status: string; count: number }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

let MOCK_OPS_ORDERS: OperationalOrder[] = [
  {
    id: "op-001",
    orderNumber: "ORD-2026-0044",
    partnerName: "Metro Trading Co.",
    partnerType: "WHOLESALE",
    items: [{ name: "Stock Pot 4.5L 24cm", qty: 24, sku: "SP-4524-SS" }, { name: "Barrier Mat 60x90cm", qty: 36, sku: "BM-6090-RD" }],
    total: 678.0,
    status: "NEW",
    assignedTo: null,
    internalNotes: [],
    createdDate: "7 Apr 2026",
    updatedDate: "7 Apr 2026",
    statusHistory: [{ status: "NEW", date: "7 Apr 2026", user: "System" }],
  },
  {
    id: "op-002",
    orderNumber: "ORD-2026-0043",
    partnerName: "Sunrise Retail Ltd",
    partnerType: "WHOLESALE",
    items: [{ name: "Shaggy Rug 120x170cm", qty: 12, sku: "SH-1217-GY" }, { name: "Chindi Rag Rug 60x90cm", qty: 48, sku: "CR-6090-MX" }],
    total: 501.6,
    status: "NEW",
    assignedTo: "Sarah",
    internalNotes: [{ text: "Urgent — customer needs before weekend", user: "Sarah", date: "6 Apr 2026, 09:00" }],
    createdDate: "6 Apr 2026",
    updatedDate: "6 Apr 2026",
    statusHistory: [{ status: "NEW", date: "6 Apr 2026", user: "System" }],
  },
  {
    id: "op-003",
    orderNumber: "ORD-2026-0042",
    partnerName: "Peak Supplies Ltd",
    partnerType: "DROPSHIP",
    items: [{ name: "Barrier Mat 60x90cm — Black", qty: 48, sku: "BM-6090-BK" }],
    total: 300.0,
    status: "PROCESSING",
    assignedTo: "Mike",
    internalNotes: [{ text: "Pick list generated", user: "Mike", date: "31 Mar 2026, 08:30" }],
    createdDate: "30 Mar 2026",
    updatedDate: "31 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "30 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "31 Mar 2026", user: "Mike" },
    ],
  },
  {
    id: "op-004",
    orderNumber: "ORD-2026-0041",
    partnerName: "Demo Wholesale Ltd",
    partnerType: "WHOLESALE",
    items: [
      { name: "Stock Pot 4.5L 24cm", qty: 12, sku: "SP-4524-SS" },
      { name: "Barrier Mat 60x90cm — Red", qty: 24, sku: "BM-6090-RD" },
      { name: "Hula Hoop 70cm", qty: 60, sku: "HH-70-ASS" },
    ],
    total: 619.2,
    status: "SHIPPED",
    assignedTo: "Alex",
    internalNotes: [],
    createdDate: "28 Mar 2026",
    updatedDate: "31 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "28 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "29 Mar 2026", user: "Alex" },
      { status: "PACKED", date: "30 Mar 2026", user: "Alex" },
      { status: "SHIPPED", date: "31 Mar 2026", user: "Alex" },
    ],
  },
  {
    id: "op-005",
    orderNumber: "ORD-2026-0040",
    partnerName: "Comet Distribution",
    partnerType: "WHOLESALE",
    items: [{ name: "Wax Burner — Geometric White", qty: 48, sku: "WB-GEO-WH" }],
    total: 216.0,
    status: "PROCESSING",
    assignedTo: "Sarah",
    internalNotes: [],
    createdDate: "27 Mar 2026",
    updatedDate: "28 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "27 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "28 Mar 2026", user: "Sarah" },
    ],
  },
  {
    id: "op-006",
    orderNumber: "ORD-2026-0039",
    partnerName: "Horizon Trade Co.",
    partnerType: "DROPSHIP",
    items: [{ name: "Bamboo Fence Screening 1mx4m", qty: 20, sku: "BF-1x4-NT" }, { name: "Gazing Ball 20cm — Silver", qty: 30, sku: "GB-20-SL" }],
    total: 422.5,
    status: "PACKED",
    assignedTo: "Mike",
    internalNotes: [{ text: "Awaiting pallet collection from DPD", user: "Mike", date: "26 Mar 2026, 15:00" }],
    createdDate: "25 Mar 2026",
    updatedDate: "26 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "25 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "25 Mar 2026", user: "Mike" },
      { status: "PACKED", date: "26 Mar 2026", user: "Mike" },
    ],
  },
  {
    id: "op-007",
    orderNumber: "ORD-2026-0038",
    partnerName: "Demo Wholesale Ltd",
    partnerType: "WHOLESALE",
    items: [{ name: "Wax Burner — Geometric White", qty: 24, sku: "WB-GEO-WH" }, { name: "Shaggy Rug 120x170cm — Grey", qty: 6, sku: "SH-1217-GY" }],
    total: 240.0,
    status: "DELIVERED",
    assignedTo: "Alex",
    internalNotes: [],
    createdDate: "24 Mar 2026",
    updatedDate: "27 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "24 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "24 Mar 2026", user: "Alex" },
      { status: "PACKED", date: "25 Mar 2026", user: "Alex" },
      { status: "SHIPPED", date: "26 Mar 2026", user: "Alex" },
      { status: "DELIVERED", date: "27 Mar 2026", user: "System" },
    ],
  },
  {
    id: "op-008",
    orderNumber: "ORD-2026-0037",
    partnerName: "Atlas B2B Ltd",
    partnerType: "WHOLESALE",
    items: [{ name: "Artificial Christmas Tree 6ft", qty: 15, sku: "ACT-6FT-GN" }],
    total: 270.0,
    status: "PROCESSING",
    assignedTo: null,
    internalNotes: [],
    createdDate: "22 Mar 2026",
    updatedDate: "23 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "22 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "23 Mar 2026", user: "Sarah" },
    ],
  },
  {
    id: "op-009",
    orderNumber: "ORD-2026-0036",
    partnerName: "Northgate Importers",
    partnerType: "DROPSHIP",
    items: [{ name: "Hallway Runner Rug 60x240cm", qty: 12, sku: "HR-6024-BG" }, { name: "Hula Hoop 56cm", qty: 120, sku: "HH-56-ASS" }],
    total: 288.0,
    status: "PACKED",
    assignedTo: "Sarah",
    internalNotes: [],
    createdDate: "20 Mar 2026",
    updatedDate: "22 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "20 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "21 Mar 2026", user: "Sarah" },
      { status: "PACKED", date: "22 Mar 2026", user: "Sarah" },
    ],
  },
  {
    id: "op-010",
    orderNumber: "ORD-2026-0035",
    partnerName: "Kestrel Trade Ltd",
    partnerType: "WHOLESALE",
    items: [{ name: "Stock Pot 9L 28cm", qty: 12, sku: "SP-9028-SS" }],
    total: 294.0,
    status: "SHIPPED",
    assignedTo: "Mike",
    internalNotes: [],
    createdDate: "18 Mar 2026",
    updatedDate: "20 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "18 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "19 Mar 2026", user: "Mike" },
      { status: "PACKED", date: "19 Mar 2026", user: "Mike" },
      { status: "SHIPPED", date: "20 Mar 2026", user: "Mike" },
    ],
  },
  {
    id: "op-011",
    orderNumber: "ORD-2026-0034",
    partnerName: "Zenith Wholesale",
    partnerType: "WHOLESALE",
    items: [{ name: "Bamboo Canes 90cm (Bundle 10)", qty: 50, sku: "BC-90-B10" }],
    total: 160.0,
    status: "DELIVERED",
    assignedTo: "Alex",
    internalNotes: [],
    createdDate: "15 Mar 2026",
    updatedDate: "18 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "15 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "15 Mar 2026", user: "Alex" },
      { status: "PACKED", date: "16 Mar 2026", user: "Alex" },
      { status: "SHIPPED", date: "17 Mar 2026", user: "Alex" },
      { status: "DELIVERED", date: "18 Mar 2026", user: "System" },
    ],
  },
  {
    id: "op-012",
    orderNumber: "ORD-2026-0033",
    partnerName: "Falcon Retail Group",
    partnerType: "DROPSHIP",
    items: [{ name: "Artificial Hedge Screening 1mx1m", qty: 30, sku: "AHS-1x1-GN" }],
    total: 255.0,
    status: "NEW",
    assignedTo: null,
    internalNotes: [],
    createdDate: "7 Apr 2026",
    updatedDate: "7 Apr 2026",
    statusHistory: [{ status: "NEW", date: "7 Apr 2026", user: "System" }],
  },
  {
    id: "op-013",
    orderNumber: "ORD-2026-0032",
    partnerName: "Summit Supplies Ltd",
    partnerType: "WHOLESALE",
    items: [{ name: "Gazing Ball 30cm — Copper", qty: 15, sku: "GB-30-CU" }, { name: "Chindi Rag Rug 80x150cm", qty: 20, sku: "CR-8015-MX" }],
    total: 312.5,
    status: "DELIVERED",
    assignedTo: "Sarah",
    internalNotes: [],
    createdDate: "10 Mar 2026",
    updatedDate: "13 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "10 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "10 Mar 2026", user: "Sarah" },
      { status: "PACKED", date: "11 Mar 2026", user: "Sarah" },
      { status: "SHIPPED", date: "12 Mar 2026", user: "Sarah" },
      { status: "DELIVERED", date: "13 Mar 2026", user: "System" },
    ],
  },
  {
    id: "op-014",
    orderNumber: "ORD-2026-0031",
    partnerName: "Demo Wholesale Ltd",
    partnerType: "WHOLESALE",
    items: [
      { name: "Bamboo Fence Screening 1mx4m", qty: 20, sku: "BF-1x4-NT" },
      { name: "Christmas Candle Bridge 7-arm", qty: 24, sku: "CCB-7A-NT" },
    ],
    total: 424.0,
    status: "DELIVERED",
    assignedTo: "Mike",
    internalNotes: [],
    createdDate: "8 Mar 2026",
    updatedDate: "12 Mar 2026",
    statusHistory: [
      { status: "NEW", date: "8 Mar 2026", user: "System" },
      { status: "PROCESSING", date: "8 Mar 2026", user: "Mike" },
      { status: "PACKED", date: "9 Mar 2026", user: "Mike" },
      { status: "SHIPPED", date: "10 Mar 2026", user: "Mike" },
      { status: "DELIVERED", date: "12 Mar 2026", user: "System" },
    ],
  },
  {
    id: "op-015",
    orderNumber: "ORD-2026-0030",
    partnerName: "Comet Distribution",
    partnerType: "WHOLESALE",
    items: [{ name: "Pencil Slim Christmas Tree 5ft", qty: 10, sku: "PCT-5FT-GN" }],
    total: 140.0,
    status: "PROCESSING",
    assignedTo: "Alex",
    internalNotes: [{ text: "Stock confirmed — ready to pick", user: "Alex", date: "5 Apr 2026, 11:00" }],
    createdDate: "5 Apr 2026",
    updatedDate: "5 Apr 2026",
    statusHistory: [
      { status: "NEW", date: "5 Apr 2026", user: "System" },
      { status: "PROCESSING", date: "5 Apr 2026", user: "Alex" },
    ],
  },
];

let MOCK_RETURNS: ReturnRequest[] = [
  {
    id: "ret-001",
    returnNumber: "RET-2026-0001",
    orderId: "op-007",
    orderNumber: "ORD-2026-0038",
    partnerName: "Demo Wholesale Ltd",
    reason: "MISSING_ITEM",
    description: "Shaggy Rug units were missing from delivery. Only 4 of 6 units received.",
    status: "RESOLVED",
    resolution: { type: "REPLACEMENT", notes: "Replacement dispatched on 28 Mar 2026 via DPD.", date: "28 Mar 2026" },
    internalNotes: [
      { text: "Checked dispatch records — confirmed short pick. Arranged replacement.", user: "Sarah", date: "27 Mar 2026, 10:00" },
    ],
    createdDate: "27 Mar 2026",
    updatedDate: "28 Mar 2026",
  },
  {
    id: "ret-002",
    returnNumber: "RET-2026-0002",
    orderId: "op-004",
    orderNumber: "ORD-2026-0041",
    partnerName: "Demo Wholesale Ltd",
    reason: "DAMAGED",
    description: "Several Stock Pots arrived with damaged lids. 4 units affected.",
    status: "INVESTIGATING",
    internalNotes: [
      { text: "Requested photos from partner — waiting on reply.", user: "Mike", date: "1 Apr 2026, 09:30" },
    ],
    createdDate: "1 Apr 2026",
    updatedDate: "1 Apr 2026",
  },
  {
    id: "ret-003",
    returnNumber: "RET-2026-0003",
    orderId: "op-011",
    orderNumber: "ORD-2026-0034",
    partnerName: "Zenith Wholesale",
    reason: "QUALITY_ISSUE",
    description: "Bamboo canes splitting on arrival. Quality below expected standard.",
    status: "REPORTED",
    internalNotes: [],
    createdDate: "19 Mar 2026",
    updatedDate: "19 Mar 2026",
  },
  {
    id: "ret-004",
    returnNumber: "RET-2026-0004",
    orderId: "op-013",
    orderNumber: "ORD-2026-0032",
    partnerName: "Summit Supplies Ltd",
    reason: "WRONG_ITEM",
    description: "Received Gazing Ball 20cm Silver instead of 30cm Copper as ordered.",
    status: "RESOLVED",
    resolution: { type: "REFUND", notes: "Full refund issued for incorrect units. Correct items resent.", date: "14 Mar 2026" },
    internalNotes: [
      { text: "Pick error confirmed. Correct item sent from reserve stock.", user: "Alex", date: "13 Mar 2026, 14:00" },
    ],
    createdDate: "13 Mar 2026",
    updatedDate: "14 Mar 2026",
  },
  {
    id: "ret-005",
    returnNumber: "RET-2026-0005",
    orderId: "op-010",
    orderNumber: "ORD-2026-0035",
    partnerName: "Kestrel Trade Ltd",
    reason: "OTHER",
    description: "Partner ordered wrong size — wishes to return and reorder 4.5L variant.",
    status: "REJECTED",
    resolution: { type: "REJECTED", notes: "Return rejected — order placed correctly per partner's own PO. Advised to resell.", date: "22 Mar 2026" },
    internalNotes: [
      { text: "PO reviewed — partner error. Return policy does not cover ordering mistakes.", user: "Sarah", date: "21 Mar 2026, 11:00" },
    ],
    createdDate: "21 Mar 2026",
    updatedDate: "22 Mar 2026",
  },
  {
    id: "ret-006",
    returnNumber: "RET-2026-0006",
    orderId: "op-005",
    orderNumber: "ORD-2026-0040",
    partnerName: "Comet Distribution",
    reason: "DAMAGED",
    description: "3 wax burners cracked in transit. Packaging appears insufficient.",
    status: "INVESTIGATING",
    internalNotes: [
      { text: "Liaising with carrier regarding transit damage claim.", user: "Mike", date: "6 Apr 2026, 10:00" },
    ],
    createdDate: "5 Apr 2026",
    updatedDate: "6 Apr 2026",
  },
];

let MOCK_ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: "log-001", timestamp: "2026-04-07T14:32:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0043 status changed from NEW to PROCESSING", entityType: "Order", entityId: "op-002" },
  { id: "log-002", timestamp: "2026-04-07T12:15:00", userId: "admin-2", userName: "Mike Thompson", actionType: "RETURN", description: "Return RET-2026-0006 created for ORD-2026-0040 — Damaged goods", entityType: "Return", entityId: "ret-006" },
  { id: "log-003", timestamp: "2026-04-07T11:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "APPROVAL", description: "Partner application approved: Falcon Retail Group (DROPSHIP)", entityType: "Partner", entityId: "p-012" },
  { id: "log-004", timestamp: "2026-04-07T09:45:00", userId: "admin-3", userName: "Alex Davies", actionType: "CONTENT_EDIT", description: "Category 'Garden & Outdoor' hero image updated", entityType: "Category", entityId: "garden-and-outdoor" },
  { id: "log-005", timestamp: "2026-04-06T16:00:00", userId: "admin-2", userName: "Mike Thompson", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0042 assigned to Mike Thompson", entityType: "Order", entityId: "op-003" },
  { id: "log-006", timestamp: "2026-04-06T14:30:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "PRICING_CHANGE", description: "MOQ updated for category 'Mats & Rugs' — min qty changed from 24 to 18", entityType: "Pricing", entityId: "mats-and-rugs" },
  { id: "log-007", timestamp: "2026-04-06T13:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "LOGIN", description: "Admin login from 192.168.1.55", entityType: "Auth", entityId: undefined },
  { id: "log-008", timestamp: "2026-04-06T10:00:00", userId: "admin-2", userName: "Mike Thompson", actionType: "RETURN", description: "Return RET-2026-0002 status changed to INVESTIGATING", entityType: "Return", entityId: "ret-002" },
  { id: "log-009", timestamp: "2026-04-05T15:30:00", userId: "admin-3", userName: "Alex Davies", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0030 status changed from NEW to PROCESSING", entityType: "Order", entityId: "op-015" },
  { id: "log-010", timestamp: "2026-04-05T14:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "CONTENT_EDIT", description: "Product family 'Bamboo Fence Screening' features list updated", entityType: "Product", entityId: "bamboo-fence-screening" },
  { id: "log-011", timestamp: "2026-04-05T11:30:00", userId: "admin-2", userName: "Mike Thompson", actionType: "APPROVAL", description: "Partner application rejected: Apex Retail Ltd — insufficient documentation", entityType: "Partner", entityId: "p-015" },
  { id: "log-012", timestamp: "2026-04-04T16:45:00", userId: "admin-3", userName: "Alex Davies", actionType: "PRICING_CHANGE", description: "Bulk discount tier added for Toys & Games — 15% off 500+ units", entityType: "Pricing", entityId: "toys-and-games" },
  { id: "log-013", timestamp: "2026-04-04T14:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0039 status changed from PROCESSING to PACKED", entityType: "Order", entityId: "op-006" },
  { id: "log-014", timestamp: "2026-04-04T11:00:00", userId: "admin-2", userName: "Mike Thompson", actionType: "CONTENT_EDIT", description: "FAQ item #12 updated: 'What are the payment terms?'", entityType: "FAQ", entityId: "faq-12" },
  { id: "log-015", timestamp: "2026-04-03T15:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "LOGIN", description: "Admin login from 192.168.1.22", entityType: "Auth", entityId: undefined },
  { id: "log-016", timestamp: "2026-04-03T13:30:00", userId: "admin-3", userName: "Alex Davies", actionType: "RETURN", description: "Return RET-2026-0001 resolved with REPLACEMENT dispatch", entityType: "Return", entityId: "ret-001" },
  { id: "log-017", timestamp: "2026-04-03T10:00:00", userId: "admin-2", userName: "Mike Thompson", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0041 status changed from PACKED to SHIPPED", entityType: "Order", entityId: "op-004" },
  { id: "log-018", timestamp: "2026-04-02T16:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "APPROVAL", description: "Partner Horizon Trade Co. suspended — overdue invoices", entityType: "Partner", entityId: "p-008" },
  { id: "log-019", timestamp: "2026-04-02T14:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "PRICING_CHANGE", description: "Brand settings updated — primary colour changed to #FBBF24", entityType: "Platform", entityId: "brand" },
  { id: "log-020", timestamp: "2026-04-01T11:30:00", userId: "admin-2", userName: "Mike Thompson", actionType: "CONTENT_EDIT", description: "Category 'Decoration & Seasonal' intro text updated", entityType: "Category", entityId: "decoration-seasonal" },
  { id: "log-021", timestamp: "2026-03-31T16:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0041 status changed from PROCESSING to PACKED", entityType: "Order", entityId: "op-004" },
  { id: "log-022", timestamp: "2026-03-31T14:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "LOGIN", description: "Admin login from 192.168.1.55", entityType: "Auth", entityId: undefined },
  { id: "log-023", timestamp: "2026-03-30T15:30:00", userId: "admin-2", userName: "Mike Thompson", actionType: "RETURN", description: "Return RET-2026-0005 rejected — partner error, not covered by policy", entityType: "Return", entityId: "ret-005" },
  { id: "log-024", timestamp: "2026-03-29T12:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "APPROVAL", description: "Partner application approved: Summit Supplies Ltd (WHOLESALE)", entityType: "Partner", entityId: "p-013" },
  { id: "log-025", timestamp: "2026-03-28T10:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0038 status changed from SHIPPED to DELIVERED", entityType: "Order", entityId: "op-007" },
  { id: "log-026", timestamp: "2026-03-27T14:30:00", userId: "admin-2", userName: "Mike Thompson", actionType: "CONTENT_EDIT", description: "Product family 'Stock Pot' gallery updated — 3 new images added", entityType: "Product", entityId: "stock-pot-4-5l-24cm" },
  { id: "log-027", timestamp: "2026-03-27T11:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "RETURN", description: "Return RET-2026-0004 resolved with REFUND", entityType: "Return", entityId: "ret-004" },
  { id: "log-028", timestamp: "2026-03-26T16:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "PRICING_CHANGE", description: "MOQ for 'Bamboo Canes 90cm' updated from 30 to 24 bundles", entityType: "Pricing", entityId: "bamboo-canes" },
  { id: "log-029", timestamp: "2026-03-25T13:30:00", userId: "admin-2", userName: "Mike Thompson", actionType: "ORDER_UPDATE", description: "Order ORD-2026-0039 status changed from NEW to PROCESSING", entityType: "Order", entityId: "op-006" },
  { id: "log-030", timestamp: "2026-03-24T10:00:00", userId: "admin-1", userName: "Sarah Mitchell", actionType: "LOGIN", description: "Admin login from 192.168.1.22", entityType: "Auth", entityId: undefined },
  { id: "log-031", timestamp: "2026-03-23T15:00:00", userId: "admin-3", userName: "Alex Davies", actionType: "APPROVAL", description: "Partner application approved: Comet Distribution (WHOLESALE)", entityType: "Partner", entityId: "p-010" },
  { id: "log-032", timestamp: "2026-03-22T14:00:00", userId: "admin-2", userName: "Mike Thompson", actionType: "CONTENT_EDIT", description: "Static page 'About HOMATZ' body content updated", entityType: "Page", entityId: "about" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

let nextReturnId = MOCK_RETURNS.length + 1;
let nextLogId = MOCK_ACTIVITY_LOG.length + 1;

// ─── Service ──────────────────────────────────────────────────────────────────

export interface OpsOrderFilters {
  status?: OpsOrderStatus;
  search?: string;
}

export interface ReturnFilters {
  status?: ReturnStatus;
}

export interface ActivityLogFilters {
  actionType?: ActivityActionType;
  userName?: string;
  startDate?: string;
  endDate?: string;
}

export const operationsService = {
  async getOperationalOrders(filters?: OpsOrderFilters): Promise<OperationalOrder[]> {
    await new Promise((r) => setTimeout(r, 300));
    let result = [...MOCK_OPS_ORDERS];
    if (filters?.status) result = result.filter((o) => o.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.partnerName.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getOperationalOrderById(id: string): Promise<OperationalOrder | null> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_OPS_ORDERS.find((o) => o.id === id) ?? null;
  },

  async updateOrderStatus(id: string, status: OpsOrderStatus, notes?: string): Promise<OperationalOrder | null> {
    await new Promise((r) => setTimeout(r, 300));
    const order = MOCK_OPS_ORDERS.find((o) => o.id === id);
    if (!order) return null;
    const prev = order.status;
    order.status = status;
    order.updatedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    order.statusHistory.push({ status, date: order.updatedDate, user: "Admin" });
    if (notes) {
      order.internalNotes.push({ text: notes, user: "Admin", date: formatTimestamp(new Date().toISOString()) });
    }
    // Log
    MOCK_ACTIVITY_LOG.unshift({
      id: `log-${String(nextLogId++).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      userId: "admin-1",
      userName: "Admin",
      actionType: "ORDER_UPDATE",
      description: `Order ${order.orderNumber} status changed from ${prev} to ${status}`,
      entityType: "Order",
      entityId: id,
    });
    return order;
  },

  async assignOrder(id: string, assignee: string | null): Promise<OperationalOrder | null> {
    await new Promise((r) => setTimeout(r, 200));
    const order = MOCK_OPS_ORDERS.find((o) => o.id === id);
    if (!order) return null;
    order.assignedTo = assignee;
    return order;
  },

  async addInternalNote(id: string, note: string): Promise<OperationalOrder | null> {
    await new Promise((r) => setTimeout(r, 200));
    const order = MOCK_OPS_ORDERS.find((o) => o.id === id);
    if (!order) return null;
    order.internalNotes.push({ text: note, user: "Admin", date: formatTimestamp(new Date().toISOString()) });
    return order;
  },

  async bulkUpdateStatus(ids: string[], status: OpsOrderStatus): Promise<OperationalOrder[]> {
    await new Promise((r) => setTimeout(r, 400));
    const updated: OperationalOrder[] = [];
    for (const id of ids) {
      const order = MOCK_OPS_ORDERS.find((o) => o.id === id);
      if (order) {
        order.status = status;
        order.updatedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        order.statusHistory.push({ status, date: order.updatedDate, user: "Admin" });
        updated.push(order);
      }
    }
    return updated;
  },

  async getReturns(filters?: ReturnFilters): Promise<ReturnRequest[]> {
    await new Promise((r) => setTimeout(r, 300));
    let result = [...MOCK_RETURNS].reverse();
    if (filters?.status) result = result.filter((r) => r.status === filters.status);
    return result;
  },

  async getReturnById(id: string): Promise<ReturnRequest | null> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_RETURNS.find((r) => r.id === id) ?? null;
  },

  async createReturn(data: {
    orderNumber: string;
    partnerName: string;
    reason: ReturnReason;
    description: string;
  }): Promise<ReturnRequest> {
    await new Promise((r) => setTimeout(r, 400));
    const id = `ret-${String(nextReturnId).padStart(3, "0")}`;
    const newReturn: ReturnRequest = {
      id,
      returnNumber: `RET-2026-${String(nextReturnId).padStart(4, "0")}`,
      orderId: "",
      orderNumber: data.orderNumber,
      partnerName: data.partnerName,
      reason: data.reason,
      description: data.description,
      status: "REPORTED",
      internalNotes: [],
      createdDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      updatedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    nextReturnId++;
    MOCK_RETURNS.push(newReturn);
    MOCK_ACTIVITY_LOG.unshift({
      id: `log-${String(nextLogId++).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      userId: "admin-1",
      userName: "Admin",
      actionType: "RETURN",
      description: `Return ${newReturn.returnNumber} created for ${data.orderNumber}`,
      entityType: "Return",
      entityId: id,
    });
    return newReturn;
  },

  async updateReturnStatus(
    id: string,
    status: ReturnStatus,
    resolution?: { type: ResolutionType; notes: string }
  ): Promise<ReturnRequest | null> {
    await new Promise((r) => setTimeout(r, 300));
    const ret = MOCK_RETURNS.find((r) => r.id === id);
    if (!ret) return null;
    ret.status = status;
    ret.updatedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    if (resolution) {
      ret.resolution = { ...resolution, date: ret.updatedDate };
    }
    MOCK_ACTIVITY_LOG.unshift({
      id: `log-${String(nextLogId++).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      userId: "admin-1",
      userName: "Admin",
      actionType: "RETURN",
      description: `Return ${ret.returnNumber} status changed to ${status}`,
      entityType: "Return",
      entityId: id,
    });
    return ret;
  },

  async addReturnNote(id: string, note: string): Promise<ReturnRequest | null> {
    await new Promise((r) => setTimeout(r, 200));
    const ret = MOCK_RETURNS.find((r) => r.id === id);
    if (!ret) return null;
    ret.internalNotes.push({ text: note, user: "Admin", date: formatTimestamp(new Date().toISOString()) });
    return ret;
  },

  async getActivityLog(filters?: ActivityLogFilters): Promise<ActivityLogEntry[]> {
    await new Promise((r) => setTimeout(r, 300));
    let result = [...MOCK_ACTIVITY_LOG];
    if (filters?.actionType) result = result.filter((e) => e.actionType === filters.actionType);
    if (filters?.userName) result = result.filter((e) => e.userName === filters.userName);
    if (filters?.startDate) result = result.filter((e) => e.timestamp >= filters.startDate!);
    if (filters?.endDate) result = result.filter((e) => e.timestamp <= filters.endDate! + "T23:59:59");
    return result;
  },

  async exportActivityLogCSV(filters?: ActivityLogFilters): Promise<string> {
    await new Promise((r) => setTimeout(r, 300));
    let entries = [...MOCK_ACTIVITY_LOG];
    if (filters?.actionType) entries = entries.filter((e) => e.actionType === filters.actionType);
    if (filters?.userName) entries = entries.filter((e) => e.userName === filters.userName);
    const header = "Timestamp,User,Action Type,Description,Entity Type,Entity ID";
    const rows = entries.map((e) =>
      [
        formatTimestamp(e.timestamp),
        e.userName,
        e.actionType,
        `"${e.description.replace(/"/g, '""')}"`,
        e.entityType ?? "",
        e.entityId ?? "",
      ].join(",")
    );
    return [header, ...rows].join("\n");
  },

  async getOpsStats(): Promise<OpsStats> {
    await new Promise((r) => setTimeout(r, 300));
    const pending = MOCK_OPS_ORDERS.filter((o) => o.status === "NEW" || o.status === "PROCESSING" || o.status === "PACKED").length;
    const statusCounts: Record<string, number> = {};
    for (const o of MOCK_OPS_ORDERS) {
      statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    }
    return {
      pendingFulfilment: pending,
      avgFulfilmentDays: 2.4,
      openSupportTickets: 3,
      overdueSupportTickets: 1,
      ordersByStatus: [
        { status: "New", count: statusCounts["NEW"] ?? 0 },
        { status: "Processing", count: statusCounts["PROCESSING"] ?? 0 },
        { status: "Packed", count: statusCounts["PACKED"] ?? 0 },
        { status: "Shipped", count: statusCounts["SHIPPED"] ?? 0 },
        { status: "Delivered", count: statusCounts["DELIVERED"] ?? 0 },
      ],
    };
  },
};
