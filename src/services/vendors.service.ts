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

function normalizeVendor(vendor: any): Vendor {
  return {
    id: vendor.id,
    name: vendor.name ?? '',
    contactEmail: vendor.contactEmail ?? '',
    contactPhone: vendor.contactPhone ?? '',
    address: vendor.address ?? '',
    notes: vendor.notes ?? '',
    status: vendor.status ?? 'active',
    mappedProductFamilies: Array.isArray(vendor.mappedProductFamilies)
      ? vendor.mappedProductFamilies
      : Array.isArray(vendor.productMappings)
        ? vendor.productMappings
            .map((mapping: any) => mapping.productFamily?.slug ?? mapping.productFamilyId)
            .filter(Boolean)
        : [],
  };
}

async function getVendors(): Promise<Vendor[]> {
  const data = await api.get<any[]>('/admin/vendors');
  return Array.isArray(data) ? data.map(normalizeVendor) : [];
}

async function getVendorById(id: string): Promise<Vendor | null> {
  const data = await api.get<any>(`/admin/vendors/${id}`);
  return data ? normalizeVendor(data) : null;
}

async function saveVendor(data: Vendor): Promise<Vendor> {
  const payload = {
    name: data.name,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    address: data.address,
    notes: data.notes,
    status: data.status,
    mappedProductFamilySlugs: data.mappedProductFamilies,
  };

  let saved: any;
  if (data.id && !data.id.startsWith('v-new')) {
    saved = await api.put<any>(`/admin/vendors/${data.id}`, payload);
  } else {
    saved = await api.post<any>('/admin/vendors', payload);
  }

  return normalizeVendor(saved);
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