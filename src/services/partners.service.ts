import { api } from '../lib/api-client';

export interface PartnerApplication {
  id: string;
  companyName: string;
  accountType: 'WHOLESALE' | 'DROPSHIP';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  accountType: 'WHOLESALE' | 'DROPSHIP';
  status: 'ACTIVE' | 'SUSPENDED';
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

async function getApplications(filters?: {
  status?: string;
  accountType?: string;
}): Promise<PartnerApplication[]> {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.accountType) params.accountType = filters.accountType;
  return api.get<PartnerApplication[]>('/admin/partners/applications', params);
}

async function getApplicationById(id: string): Promise<PartnerApplication | null> {
  return api.get<PartnerApplication>(`/admin/partners/applications/${id}`);
}

async function approveApplication(id: string, notes: string): Promise<void> {
  await api.post(`/admin/partners/applications/${id}/approve`, { notes });
}

async function rejectApplication(id: string, notes: string): Promise<void> {
  await api.post(`/admin/partners/applications/${id}/reject`, { notes });
}

async function getPartners(filters?: {
  status?: string;
  accountType?: string;
  search?: string;
}): Promise<Partner[]> {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.accountType) params.accountType = filters.accountType;
  if (filters?.search) params.search = filters.search;
  return api.get<Partner[]>('/admin/partners', params);
}

async function getPartnerById(id: string): Promise<Partner | null> {
  return api.get<Partner>(`/admin/partners/${id}`);
}

async function suspendPartner(id: string, reason: string): Promise<void> {
  await api.post(`/admin/partners/${id}/suspend`, { reason });
}

async function reactivatePartner(id: string): Promise<void> {
  await api.post(`/admin/partners/${id}/reactivate`);
}

async function savePartnerNotes(_id: string, _notes: string): Promise<void> {
  // Notes are saved via the partner detail update; no dedicated endpoint
}

async function getPartnerOrders(partnerId: string): Promise<PartnerOrder[]> {
  return api.get<PartnerOrder[]>(`/admin/partners/${partnerId}/orders`);
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
