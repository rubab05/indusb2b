export interface PartnerApplication {
  id: string;
  companyName: string;
  accountType: "WHOLESALE" | "DROPSHIP";
  status: "PENDING" | "APPROVED" | "REJECTED";
  dateApplied: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyRegNumber: string;
  address: { line1: string; line2?: string; city: string; postcode: string; country: string };
  revenueRange?: string;
  categoriesOfInterest?: string[];
  websiteUrl?: string;
  platform?: string;
  estimatedMonthlyVolume?: string;
  notes?: string;
  adminNotes?: string;
}

export interface Partner {
  id: string;
  companyName: string;
  accountType: "WHOLESALE" | "DROPSHIP";
  status: "ACTIVE" | "SUSPENDED";
  joinedDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  contactName: string;
  contactEmail: string;
  internalNotes: string;
}

export interface PartnerOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

let applicationStore: PartnerApplication[] = [
  {
    id: "app-1",
    companyName: "Bristol Trade Supplies Ltd",
    accountType: "WHOLESALE",
    status: "PENDING",
    dateApplied: "2026-04-01",
    contactName: "James Mitchell",
    contactEmail: "james@bristoltrade.co.uk",
    contactPhone: "+44 117 900 1234",
    companyRegNumber: "12345678",
    address: { line1: "12 Commercial Road", city: "Bristol", postcode: "BS1 6HG", country: "United Kingdom" },
    revenueRange: "£500k–£1m",
    categoriesOfInterest: ["Kitchen & Household", "Garden & Outdoor"],
    notes: "Established distributor with 15 years in the trade.",
  },
  {
    id: "app-2",
    companyName: "Dropify Retail Ltd",
    accountType: "DROPSHIP",
    status: "PENDING",
    dateApplied: "2026-04-02",
    contactName: "Sara Ahmed",
    contactEmail: "sara@dropify.io",
    contactPhone: "+44 20 7946 0001",
    companyRegNumber: "87654321",
    address: { line1: "99 Tech Park", line2: "Suite 4", city: "London", postcode: "EC1A 1BB", country: "United Kingdom" },
    websiteUrl: "https://dropify.io",
    platform: "Shopify",
    estimatedMonthlyVolume: "200–500 orders",
  },
  {
    id: "app-3",
    companyName: "Northern Home Goods",
    accountType: "WHOLESALE",
    status: "PENDING",
    dateApplied: "2026-04-03",
    contactName: "David Clarke",
    contactEmail: "david@northernhome.co.uk",
    contactPhone: "+44 113 555 6789",
    companyRegNumber: "11223344",
    address: { line1: "45 Warehouse Lane", city: "Leeds", postcode: "LS2 7HY", country: "United Kingdom" },
    revenueRange: "£1m–£5m",
    categoriesOfInterest: ["Mats & Rugs", "Decoration & Seasonal"],
  },
  {
    id: "app-4",
    companyName: "EcomEdge Solutions",
    accountType: "DROPSHIP",
    status: "PENDING",
    dateApplied: "2026-04-04",
    contactName: "Priya Patel",
    contactEmail: "priya@ecomedge.com",
    contactPhone: "+44 121 900 4321",
    companyRegNumber: "55667788",
    address: { line1: "7 Digital Square", city: "Birmingham", postcode: "B1 1BB", country: "United Kingdom" },
    websiteUrl: "https://ecomedge.com",
    platform: "WooCommerce",
    estimatedMonthlyVolume: "100–200 orders",
  },
  {
    id: "app-5",
    companyName: "Scottish Gift Wholesale",
    accountType: "WHOLESALE",
    status: "PENDING",
    dateApplied: "2026-04-05",
    contactName: "Hamish MacLeod",
    contactEmail: "hamish@scottishgift.co.uk",
    contactPhone: "+44 131 200 5678",
    companyRegNumber: "99001122",
    address: { line1: "22 Old Town Row", city: "Edinburgh", postcode: "EH1 2AB", country: "United Kingdom" },
    revenueRange: "£250k–£500k",
    categoriesOfInterest: ["Toys & Games", "Decoration & Seasonal"],
  },
  {
    id: "app-6",
    companyName: "HomeFlow Digital",
    accountType: "DROPSHIP",
    status: "APPROVED",
    dateApplied: "2026-03-15",
    contactName: "Lena Brooks",
    contactEmail: "lena@homeflow.co.uk",
    contactPhone: "+44 161 400 9876",
    companyRegNumber: "33445566",
    address: { line1: "100 Innovation Way", city: "Manchester", postcode: "M1 1AA", country: "United Kingdom" },
    websiteUrl: "https://homeflow.co.uk",
    platform: "Shopify",
    estimatedMonthlyVolume: "500+ orders",
    adminNotes: "Strong portfolio, approved fast-track.",
  },
  {
    id: "app-7",
    companyName: "TradeZone Supplies",
    accountType: "WHOLESALE",
    status: "REJECTED",
    dateApplied: "2026-03-10",
    contactName: "Tom Jennings",
    contactEmail: "tom@tradezone.co.uk",
    contactPhone: "+44 20 8000 1111",
    companyRegNumber: "00000001",
    address: { line1: "1 Nowhere St", city: "London", postcode: "E1 0AA", country: "United Kingdom" },
    revenueRange: "Under £250k",
    adminNotes: "Could not verify company registration.",
  },
];

let partnerStore: Partner[] = [
  { id: "p-1", companyName: "HomeFlow Digital", accountType: "DROPSHIP", status: "ACTIVE", joinedDate: "2026-03-20", lastOrderDate: "2026-04-05", totalOrders: 47, contactName: "Lena Brooks", contactEmail: "lena@homeflow.co.uk", internalNotes: "High-volume dropship partner. Priority support." },
  { id: "p-2", companyName: "Bristol Trade Supplies Ltd", accountType: "WHOLESALE", status: "ACTIVE", joinedDate: "2026-02-10", lastOrderDate: "2026-04-01", totalOrders: 12, contactName: "James Mitchell", contactEmail: "james@bristoltrade.co.uk", internalNotes: "" },
  { id: "p-3", companyName: "Premier Retail UK", accountType: "WHOLESALE", status: "ACTIVE", joinedDate: "2026-01-05", lastOrderDate: "2026-03-28", totalOrders: 34, contactName: "Angela Webb", contactEmail: "angela@premierretail.co.uk", internalNotes: "Net-30 payment terms agreed." },
  { id: "p-4", companyName: "QuickShip Ecom", accountType: "DROPSHIP", status: "SUSPENDED", joinedDate: "2026-01-15", lastOrderDate: "2026-02-20", totalOrders: 8, contactName: "Ryan O'Brien", contactEmail: "ryan@quickshipecom.com", internalNotes: "Suspended pending balance resolution." },
  { id: "p-5", companyName: "Midlands Mercantile", accountType: "WHOLESALE", status: "ACTIVE", joinedDate: "2025-12-01", lastOrderDate: "2026-04-03", totalOrders: 56, contactName: "Patricia Ford", contactEmail: "patricia@midlandsmerc.co.uk", internalNotes: "" },
  { id: "p-6", companyName: "Garden Direct UK", accountType: "WHOLESALE", status: "ACTIVE", joinedDate: "2025-11-20", lastOrderDate: "2026-03-15", totalOrders: 23, contactName: "Simon Holt", contactEmail: "simon@gardendirectuk.com", internalNotes: "Seasonal buyer — peak in spring/summer." },
  { id: "p-7", companyName: "ShopSmart Dropship", accountType: "DROPSHIP", status: "ACTIVE", joinedDate: "2026-02-28", lastOrderDate: "2026-04-06", totalOrders: 91, contactName: "Mei Zhao", contactEmail: "mei@shopsmart.io", internalNotes: "Top-performing dropship partner." },
  { id: "p-8", companyName: "Edinburgh Interiors", accountType: "WHOLESALE", status: "ACTIVE", joinedDate: "2026-03-01", lastOrderDate: "2026-03-30", totalOrders: 7, contactName: "Fiona Duncan", contactEmail: "fiona@edinburghinteriors.co.uk", internalNotes: "" },
  { id: "p-9", companyName: "WestCoast Wholesale", accountType: "WHOLESALE", status: "SUSPENDED", joinedDate: "2025-10-15", lastOrderDate: "2025-12-10", totalOrders: 19, contactName: "Gary Stone", contactEmail: "gary@westcoastwholesale.co.uk", internalNotes: "Suspended: multiple late payments." },
  { id: "p-10", companyName: "Nova Online Store", accountType: "DROPSHIP", status: "ACTIVE", joinedDate: "2026-01-20", lastOrderDate: "2026-04-04", totalOrders: 62, contactName: "Aisha Kamara", contactEmail: "aisha@novaonlinestore.com", internalNotes: "" },
];

const partnerOrdersMap: Record<string, PartnerOrder[]> = {
  "p-1": [
    { id: "o-101", orderNumber: "HMZ-2026-0101", date: "2026-04-05", total: 340.5, status: "Processing" },
    { id: "o-102", orderNumber: "HMZ-2026-0099", date: "2026-04-01", total: 125.0, status: "Delivered" },
    { id: "o-103", orderNumber: "HMZ-2026-0090", date: "2026-03-25", total: 880.0, status: "Delivered" },
  ],
  "p-2": [
    { id: "o-201", orderNumber: "HMZ-2026-0088", date: "2026-04-01", total: 1200.0, status: "Shipped" },
    { id: "o-202", orderNumber: "HMZ-2026-0070", date: "2026-03-20", total: 950.0, status: "Delivered" },
  ],
};

async function getApplications(filters?: { status?: string; accountType?: string }): Promise<PartnerApplication[]> {
  await delay();
  let results = [...applicationStore];
  if (filters?.status && filters.status !== "all") {
    results = results.filter((a) => a.status === filters.status);
  }
  if (filters?.accountType && filters.accountType !== "all") {
    results = results.filter((a) => a.accountType === filters.accountType);
  }
  return results;
}

async function getApplicationById(id: string): Promise<PartnerApplication | null> {
  await delay();
  return applicationStore.find((a) => a.id === id) ?? null;
}

async function approveApplication(id: string, notes: string): Promise<void> {
  await delay();
  const app = applicationStore.find((a) => a.id === id);
  if (app) {
    app.status = "APPROVED";
    app.adminNotes = notes;
  }
}

async function rejectApplication(id: string, notes: string): Promise<void> {
  await delay();
  const app = applicationStore.find((a) => a.id === id);
  if (app) {
    app.status = "REJECTED";
    app.adminNotes = notes;
  }
}

async function getPartners(filters?: { status?: string; accountType?: string; search?: string }): Promise<Partner[]> {
  await delay();
  let results = [...partnerStore];
  if (filters?.status && filters.status !== "all") {
    results = results.filter((p) => p.status === filters.status);
  }
  if (filters?.accountType && filters.accountType !== "all") {
    results = results.filter((p) => p.accountType === filters.accountType);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.companyName.toLowerCase().includes(q) ||
        p.contactEmail.toLowerCase().includes(q) ||
        p.contactName.toLowerCase().includes(q),
    );
  }
  return results;
}

async function getPartnerById(id: string): Promise<Partner | null> {
  await delay();
  return partnerStore.find((p) => p.id === id) ?? null;
}

async function suspendPartner(id: string, _reason: string): Promise<void> {
  await delay();
  const partner = partnerStore.find((p) => p.id === id);
  if (partner) partner.status = "SUSPENDED";
}

async function reactivatePartner(id: string): Promise<void> {
  await delay();
  const partner = partnerStore.find((p) => p.id === id);
  if (partner) partner.status = "ACTIVE";
}

async function savePartnerNotes(id: string, notes: string): Promise<void> {
  await delay();
  const partner = partnerStore.find((p) => p.id === id);
  if (partner) partner.internalNotes = notes;
}

async function getPartnerOrders(partnerId: string): Promise<PartnerOrder[]> {
  await delay();
  return partnerOrdersMap[partnerId] ?? [];
}

export const partnersService = {
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getPartners,
  getPartnerById,
  suspendPartner,
  reactivatePartner,
  savePartnerNotes,
  getPartnerOrders,
};
