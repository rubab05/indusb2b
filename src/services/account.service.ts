export interface BusinessProfile {
  companyName: string;
  registrationNumber: string;
  addressLine1: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  website: string;
}

export interface ContactDetails {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface NotificationPreferences {
  orderConfirmations: boolean;
  orderShipped: boolean;
  invoiceDue: boolean;
  promotions: boolean;
}

export interface BusinessDocument {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  fileSize: string;
}

export interface AccountProfile {
  business: BusinessProfile;
  contact: ContactDetails;
  notifications: NotificationPreferences;
  documents: BusinessDocument[];
}

let MOCK_PROFILE: AccountProfile = {
  business: {
    companyName: "Demo Wholesale Ltd",
    registrationNumber: "12345678",
    addressLine1: "14 Trade Park Way",
    city: "Manchester",
    postcode: "M1 4AB",
    country: "United Kingdom",
    phone: "0161 234 5678",
    website: "https://www.demowholesale.co.uk",
  },
  contact: {
    contactName: "James Patel",
    contactEmail: "james@demowholesale.co.uk",
    contactPhone: "07700 900 123",
  },
  notifications: {
    orderConfirmations: true,
    orderShipped: true,
    invoiceDue: true,
    promotions: false,
  },
  documents: [
    { id: "doc-1", name: "Certificate of Incorporation", type: "PDF", uploadedDate: "1 Jan 2026", fileSize: "245 KB" },
    { id: "doc-2", name: "VAT Registration Certificate", type: "PDF", uploadedDate: "1 Jan 2026", fileSize: "118 KB" },
    { id: "doc-3", name: "Trade Reference — Supplier A", type: "PDF", uploadedDate: "2 Jan 2026", fileSize: "89 KB" },
  ],
};

export const accountService = {
  async getProfile(): Promise<AccountProfile> {
    await new Promise((r) => setTimeout(r, 400));
    return structuredClone(MOCK_PROFILE);
  },

  async updateBusiness(data: BusinessProfile): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    MOCK_PROFILE.business = { ...data };
  },

  async updateContact(data: ContactDetails): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    MOCK_PROFILE.contact = { ...data };
  },

  async updateNotifications(data: NotificationPreferences): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    MOCK_PROFILE.notifications = { ...data };
  },

  async changePassword(current: string, next: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 600));
    if (current.length < 4) throw new Error("Current password is incorrect.");
    if (next.length < 8) throw new Error("New password must be at least 8 characters.");
  },
};
