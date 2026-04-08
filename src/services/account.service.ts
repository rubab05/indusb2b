import { api } from '../lib/api-client';

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

interface ApiUser {
  companyName?: string;
  email?: string;
  contactName?: string;
  registrationNumber?: string;
  addressLine1?: string;
  city?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  website?: string;
}

function mapUserToProfile(user: ApiUser): AccountProfile {
  return {
    business: {
      companyName: user.companyName ?? '',
      registrationNumber: user.registrationNumber ?? '',
      addressLine1: user.addressLine1 ?? '',
      city: user.city ?? '',
      postcode: user.postcode ?? '',
      country: user.country ?? 'United Kingdom',
      phone: user.phone ?? '',
      website: user.website ?? '',
    },
    contact: {
      contactName: user.contactName ?? '',
      contactEmail: user.email ?? '',
      contactPhone: user.phone ?? '',
    },
    notifications: {
      orderConfirmations: true,
      orderShipped: true,
      invoiceDue: true,
      promotions: false,
    },
    documents: [],
  };
}

export const accountService = {
  async getProfile(): Promise<AccountProfile> {
    const user = await api.get<ApiUser>('/auth/me');
    return mapUserToProfile(user);
  },

  async updateBusiness(data: BusinessProfile): Promise<void> {
    await api.put('/auth/me', data);
  },

  async updateContact(data: ContactDetails): Promise<void> {
    await api.put('/auth/me', data);
  },

  async updateNotifications(_data: NotificationPreferences): Promise<void> {
    // Notification preferences stored client-side — no dedicated backend endpoint
  },

  async changePassword(current: string, next: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword: current,
      newPassword: next,
      confirmPassword: next,
    });
  },
};
