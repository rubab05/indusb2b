export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  mappedProductFamilies: string[];
  notes: string;
  status: "active" | "inactive";
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

let vendorStore: Vendor[] = [
  {
    id: "v-1",
    name: "Indusfort Manufacturing",
    contactEmail: "supply@indusfort.com",
    contactPhone: "+44 161 800 1234",
    address: "Unit 12, Salford Business Park, Manchester, M5 4AB",
    mappedProductFamilies: ["stock-pot-4-5l-24cm", "barrier-mats", "shaggy-rugs"],
    notes: "Primary supplier. Lead time: 3-4 weeks.",
    status: "active",
  },
  {
    id: "v-2",
    name: "Green Garden Exports",
    contactEmail: "export@greengarden.co",
    contactPhone: "+44 20 8000 5678",
    address: "45 Trade Centre, Bromley, London, BR1 3PQ",
    mappedProductFamilies: ["bamboo-fence-screening", "bamboo-canes", "green-garden-sticks", "wooden-garden-stakes", "artificial-hedge-screening", "gazing-balls"],
    notes: "Seasonal stock — order by February for spring arrival.",
    status: "active",
  },
  {
    id: "v-3",
    name: "Festive Goods UK",
    contactEmail: "orders@festivegoodsuk.com",
    contactPhone: "+44 1234 567 890",
    address: "8 Celebration Way, Leicester, LE1 5AA",
    mappedProductFamilies: ["wax-burners", "christmas-candle-bridges", "artificial-christmas-trees", "pencil-slim-christmas-trees"],
    notes: "Christmas range available from July.",
    status: "active",
  },
  {
    id: "v-4",
    name: "Play & Learn Ltd",
    contactEmail: "b2b@playandlearn.co.uk",
    contactPhone: "+44 113 300 4321",
    address: "33 Toy Lane, Leeds, LS1 4BB",
    mappedProductFamilies: ["hula-hoops"],
    notes: "CE certified. Lead time: 2 weeks.",
    status: "active",
  },
  {
    id: "v-5",
    name: "Chindi Craft Imports",
    contactEmail: "imports@chindicraft.com",
    contactPhone: "+44 115 200 7777",
    address: "19 Fabric Road, Nottingham, NG1 2CC",
    mappedProductFamilies: ["chindi-rag-rugs", "hallway-runner-rugs"],
    notes: "Hand-woven products. Limited stock quantities.",
    status: "active",
  },
  {
    id: "v-6",
    name: "OldStock Clearances",
    contactEmail: "info@oldstockclearances.co.uk",
    contactPhone: "+44 29 2000 3456",
    address: "7 Warehouse Row, Cardiff, CF10 1AA",
    mappedProductFamilies: [],
    notes: "Inactive — no current product mappings.",
    status: "inactive",
  },
];

async function getVendors(): Promise<Vendor[]> {
  await delay();
  return [...vendorStore];
}

async function getVendorById(id: string): Promise<Vendor | null> {
  await delay();
  return vendorStore.find((v) => v.id === id) ?? null;
}

async function saveVendor(data: Vendor): Promise<Vendor> {
  await delay();
  const idx = vendorStore.findIndex((v) => v.id === data.id);
  if (idx >= 0) {
    vendorStore[idx] = data;
  } else {
    data.id = `v-${Date.now()}`;
    vendorStore.push(data);
  }
  return data;
}

async function deleteVendor(id: string): Promise<void> {
  await delay();
  vendorStore = vendorStore.filter((v) => v.id !== id);
}

export const vendorsService = {
  getVendors,
  getVendorById,
  saveVendor,
  deleteVendor,
};
