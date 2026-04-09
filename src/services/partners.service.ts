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

// Raw backend shapes
interface RawApplication {
  id: string;
  userId?: string;
  accountType: string;
  status: string;
  businessType?: string;
  categoriesOfInterest?: string[];
  notes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  user?: {
    id?: string;
    email?: string;
    companyName?: string;
    accountType?: string;
    profile?: {
      contactName?: string;
      contactEmail?: string;
      contactPhone?: string;
      companyRegNumber?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      postcode?: string;
      country?: string;
      revenueRange?: string;
      websiteUrl?: string;
      platform?: string;
      estimatedMonthlyVolume?: string;
    } | null;
  };
}

interface RawPartner {
  id: string;
  companyName: string;
  email: string;
  accountType: string;
  approvalStatus: string;
  createdAt: string;
  profile?: { contactName?: string; contactEmail?: string } | null;
  _count?: { orders?: number };
}

interface RawPartnerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: string | number;
  status: string;
}

function normalizeApplication(raw: RawApplication): PartnerApplication {
  const profile = raw.user?.profile;
  return {
    id: raw.id,
    companyName: raw.user?.companyName ?? '',
    accountType: raw.accountType as 'WHOLESALE' | 'DROPSHIP',
    status: raw.status as 'PENDING' | 'APPROVED' | 'REJECTED',
    dateApplied: raw.createdAt,
    contactName: profile?.contactName ?? raw.user?.email ?? '',
    contactEmail: profile?.contactEmail ?? raw.user?.email ?? '',
    contactPhone: profile?.contactPhone ?? '',
    companyRegNumber: profile?.companyRegNumber ?? '',
    address: {
      line1: profile?.addressLine1 ?? '',
      line2: profile?.addressLine2,
      city: profile?.city ?? '',
      postcode: profile?.postcode ?? '',
      country: profile?.country ?? 'United Kingdom',
    },
    revenueRange: profile?.revenueRange,
    categoriesOfInterest: raw.categoriesOfInterest,
    websiteUrl: profile?.websiteUrl,
    platform: profile?.platform,
    estimatedMonthlyVolume: profile?.estimatedMonthlyVolume,
    notes: raw.notes ?? undefined,
    adminNotes: raw.adminNotes ?? undefined,
  };
}

function normalizePartner(raw: RawPartner): Partner {
  return {
    id: raw.id,
    companyName: raw.companyName,
    accountType: raw.accountType as 'WHOLESALE' | 'DROPSHIP',
    status: raw.approvalStatus === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    joinedDate: raw.createdAt,
    totalOrders: raw._count?.orders ?? 0,
    contactName: raw.profile?.contactName ?? '',
    contactEmail: raw.profile?.contactEmail ?? raw.email,
    internalNotes: '',
  };
}

function normalizePartnerOrder(raw: RawPartnerOrder): PartnerOrder {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    date: raw.createdAt,
    total: typeof raw.total === 'number' ? raw.total : parseFloat(raw.total) || 0,
    status: raw.status,
  };
}

async function getApplications(filters?: {
  status?: string;
  accountType?: string;
}): Promise<PartnerApplication[]> {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.accountType) params.accountType = filters.accountType;
  const raw = await api.get<RawApplication[]>('/admin/partners/applications', params);
  return raw.map(normalizeApplication);
}

async function getApplicationById(id: string): Promise<PartnerApplication | null> {
  const raw = await api.get<RawApplication>(`/admin/partners/applications/${id}`);
  return raw ? normalizeApplication(raw) : null;
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
  const raw = await api.get<RawPartner[]>('/admin/partners', params);
  return raw.map(normalizePartner);
}

async function getPartnerById(id: string): Promise<Partner | null> {
  const raw = await api.get<RawPartner>(`/admin/partners/${id}`);
  return raw ? normalizePartner(raw) : null;
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
  const raw = await api.get<RawPartnerOrder[]>(`/admin/partners/${partnerId}/orders`);
  return raw.map(normalizePartnerOrder);
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