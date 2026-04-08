import { api } from '../lib/api-client';

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  mappedProductFamilies: string[];
  notes: string;
  status: 'active' | 'inactive';
}

async function getVendors(): Promise<Vendor[]> {
  return api.get<Vendor[]>('/admin/vendors');
}

async function getVendorById(id: string): Promise<Vendor | null> {
  return api.get<Vendor>(`/admin/vendors/${id}`);
}

async function saveVendor(data: Vendor): Promise<Vendor> {
  if (data.id && !data.id.startsWith('v-new')) {
    return api.put<Vendor>(`/admin/vendors/${data.id}`, data);
  }
  return api.post<Vendor>('/admin/vendors', data);
}

async function deleteVendor(id: string): Promise<void> {
  await api.delete(`/admin/vendors/${id}`);
}

export const vendorsService = {
  getVendors,
  getVendorById,
  saveVendor,
  deleteVendor,
};
