import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';
import * as emailService from './email.service.js';
import type {
  ReviewApplicationInput,
  CreatePricingRuleInput,
  UpdatePricingRuleInput,
  CreateMOQRuleInput,
  UpdateMOQRuleInput,
  CreateBulkDiscountTierInput,
  UpdateBulkDiscountTierInput,
  CreateVendorInput,
  UpdateVendorInput,
  UpdateBrandConfigInput,
} from '../validators/admin.validators.js';

// ─── Activity Log Helper ─────────────────────────────────

export async function logActivity(params: {
  userId?: string;
  userName: string;
  actionType: string;
  description: string;
  entityType?: string;
  entityId?: string;
}) {
  return prisma.activityLog.create({ data: params });
}

// ─── Partner Applications ────────────────────────────────

export async function listApplications(filters: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;

  const [applications, total] = await Promise.all([
    prisma.partnerApplication.findMany({
      where,
      include: { user: { select: { id: true, email: true, companyName: true, accountType: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.partnerApplication.count({ where }),
  ]);

  return { applications, total, page, limit };
}

export async function approveApplication(
  applicationId: string,
  adminId: string,
  adminName: string,
  data: ReviewApplicationInput
) {
  const application = await prisma.partnerApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });
  if (!application) throw ApiError.notFound('Application not found');
  if (application.status !== 'PENDING') {
    throw ApiError.badRequest('Application has already been reviewed');
  }

  const [updatedApp] = await prisma.$transaction([
    prisma.partnerApplication.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        adminNotes: data.adminNotes,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: application.userId },
      data: { approvalStatus: 'APPROVED' },
    }),
  ]);

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'APPROVAL',
    description: `Approved application for ${application.user.companyName}`,
    entityType: 'PartnerApplication',
    entityId: applicationId,
  });

  // Send approval email (non-blocking)
  emailService
    .sendApplicationApproved({
      to: application.user.email,
      companyName: application.user.companyName,
      contactName: application.user.companyName,
      accountType: application.user.accountType,
      adminNotes: data.adminNotes,
    })
    .catch((err: unknown) => logger.error('Failed to send approval email', err));

  return updatedApp;
}

export async function rejectApplication(
  applicationId: string,
  adminId: string,
  adminName: string,
  data: ReviewApplicationInput
) {
  const application = await prisma.partnerApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });
  if (!application) throw ApiError.notFound('Application not found');
  if (application.status !== 'PENDING') {
    throw ApiError.badRequest('Application has already been reviewed');
  }

  const [updatedApp] = await prisma.$transaction([
    prisma.partnerApplication.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        adminNotes: data.adminNotes,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: application.userId },
      data: { approvalStatus: 'REJECTED' },
    }),
  ]);

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'APPROVAL',
    description: `Rejected application for ${application.user.companyName}`,
    entityType: 'PartnerApplication',
    entityId: applicationId,
  });

  // Send rejection email (non-blocking)
  emailService
    .sendApplicationRejected({
      to: application.user.email,
      companyName: application.user.companyName,
      contactName: application.user.companyName,
      adminNotes: data.adminNotes,
    })
    .catch((err: unknown) => logger.error('Failed to send rejection email', err));

  return updatedApp;
}

// ─── Partner Management ──────────────────────────────────

export async function listPartners(filters: {
  status?: string;
  accountType?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { role: 'PARTNER' };
  if (filters.status) where.approvalStatus = filters.status;
  if (filters.accountType) where.accountType = filters.accountType;
  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { companyName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [partners, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        companyName: true,
        accountType: true,
        approvalStatus: true,
        createdAt: true,
        profile: { select: { contactName: true, contactEmail: true } },
        orders: { select: { id: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { partners, total, page, limit };
}

export async function getPartnerDetail(partnerId: string) {
  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    include: {
      profile: true,
      applications: { orderBy: { createdAt: 'desc' }, take: 1 },
      orders: {
        select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!partner) throw ApiError.notFound('Partner not found');
  const { passwordHash: _, ...safe } = partner;
  return safe;
}

export async function suspendPartner(
  partnerId: string,
  adminId: string,
  adminName: string
) {
  const partner = await prisma.user.findUnique({ where: { id: partnerId } });
  if (!partner) throw ApiError.notFound('Partner not found');
  if (partner.approvalStatus === 'SUSPENDED') {
    throw ApiError.badRequest('Partner is already suspended');
  }

  const updated = await prisma.user.update({
    where: { id: partnerId },
    data: { approvalStatus: 'SUSPENDED' },
    select: { id: true, email: true, companyName: true, approvalStatus: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'APPROVAL',
    description: `Suspended partner ${partner.companyName}`,
    entityType: 'Partner',
    entityId: partnerId,
  });

  return updated;
}

export async function reactivatePartner(
  partnerId: string,
  adminId: string,
  adminName: string
) {
  const partner = await prisma.user.findUnique({ where: { id: partnerId } });
  if (!partner) throw ApiError.notFound('Partner not found');
  if (partner.approvalStatus !== 'SUSPENDED') {
    throw ApiError.badRequest('Partner is not suspended');
  }

  const updated = await prisma.user.update({
    where: { id: partnerId },
    data: { approvalStatus: 'APPROVED' },
    select: { id: true, email: true, companyName: true, approvalStatus: true },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'APPROVAL',
    description: `Reactivated partner ${partner.companyName}`,
    entityType: 'Partner',
    entityId: partnerId,
  });

  return updated;
}

// ─── Pricing Rules ───────────────────────────────────────

export async function listPricingRules() {
  return prisma.pricingRule.findMany({ include: { category: { select: { name: true, slug: true } } } });
}

export async function createPricingRule(
  data: CreatePricingRuleInput,
  adminId: string,
  adminName: string
) {
  const rule = await prisma.pricingRule.create({ data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Created pricing rule`,
    entityType: 'PricingRule',
    entityId: rule.id,
  });

  return rule;
}

export async function updatePricingRule(
  ruleId: string,
  data: UpdatePricingRuleInput,
  adminId: string,
  adminName: string
) {
  const existing = await prisma.pricingRule.findUnique({ where: { id: ruleId } });
  if (!existing) throw ApiError.notFound('Pricing rule not found');

  const updated = await prisma.pricingRule.update({ where: { id: ruleId }, data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Updated pricing rule ${ruleId}`,
    entityType: 'PricingRule',
    entityId: ruleId,
  });

  return updated;
}

export async function deletePricingRule(ruleId: string, adminId: string, adminName: string) {
  const existing = await prisma.pricingRule.findUnique({ where: { id: ruleId } });
  if (!existing) throw ApiError.notFound('Pricing rule not found');

  await prisma.pricingRule.delete({ where: { id: ruleId } });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Deleted pricing rule ${ruleId}`,
    entityType: 'PricingRule',
    entityId: ruleId,
  });
}

// ─── MOQ Rules ───────────────────────────────────────────

export async function listMOQRules() {
  return prisma.mOQRule.findMany({ include: { category: { select: { name: true, slug: true } } } });
}

export async function createMOQRule(
  data: CreateMOQRuleInput,
  adminId: string,
  adminName: string
) {
  const rule = await prisma.mOQRule.create({ data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Created MOQ rule (min: ${data.minQuantity})`,
    entityType: 'MOQRule',
    entityId: rule.id,
  });

  return rule;
}

export async function updateMOQRule(
  ruleId: string,
  data: UpdateMOQRuleInput,
  adminId: string,
  adminName: string
) {
  const existing = await prisma.mOQRule.findUnique({ where: { id: ruleId } });
  if (!existing) throw ApiError.notFound('MOQ rule not found');

  const updated = await prisma.mOQRule.update({ where: { id: ruleId }, data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Updated MOQ rule ${ruleId}`,
    entityType: 'MOQRule',
    entityId: ruleId,
  });

  return updated;
}

export async function deleteMOQRule(ruleId: string, adminId: string, adminName: string) {
  const existing = await prisma.mOQRule.findUnique({ where: { id: ruleId } });
  if (!existing) throw ApiError.notFound('MOQ rule not found');

  await prisma.mOQRule.delete({ where: { id: ruleId } });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Deleted MOQ rule ${ruleId}`,
    entityType: 'MOQRule',
    entityId: ruleId,
  });
}

// ─── Bulk Discount Tiers ─────────────────────────────────

export async function listBulkDiscountTiers() {
  return prisma.bulkDiscountTier.findMany({ orderBy: { minQty: 'asc' } });
}

export async function createBulkDiscountTier(
  data: CreateBulkDiscountTierInput,
  adminId: string,
  adminName: string
) {
  const tier = await prisma.bulkDiscountTier.create({ data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Created bulk discount tier "${data.tierName}"`,
    entityType: 'BulkDiscountTier',
    entityId: tier.id,
  });

  return tier;
}

export async function updateBulkDiscountTier(
  tierId: string,
  data: UpdateBulkDiscountTierInput,
  adminId: string,
  adminName: string
) {
  const existing = await prisma.bulkDiscountTier.findUnique({ where: { id: tierId } });
  if (!existing) throw ApiError.notFound('Bulk discount tier not found');

  const updated = await prisma.bulkDiscountTier.update({ where: { id: tierId }, data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Updated bulk discount tier ${tierId}`,
    entityType: 'BulkDiscountTier',
    entityId: tierId,
  });

  return updated;
}

export async function deleteBulkDiscountTier(tierId: string, adminId: string, adminName: string) {
  const existing = await prisma.bulkDiscountTier.findUnique({ where: { id: tierId } });
  if (!existing) throw ApiError.notFound('Bulk discount tier not found');

  await prisma.bulkDiscountTier.delete({ where: { id: tierId } });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'PRICING_CHANGE',
    description: `Deleted bulk discount tier ${tierId}`,
    entityType: 'BulkDiscountTier',
    entityId: tierId,
  });
}

// ─── Vendors ─────────────────────────────────────────────

export async function listVendors(filters: { status?: string; page?: number; limit?: number }) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: { productMappings: { include: { productFamily: { select: { name: true, slug: true } } } } },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.vendor.count({ where }),
  ]);

  return { vendors, total, page, limit };
}

export async function getVendorById(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { productMappings: { include: { productFamily: { select: { id: true, name: true, slug: true } } } } },
  });
  if (!vendor) throw ApiError.notFound('Vendor not found');
  return vendor;
}

export async function createVendor(
  data: CreateVendorInput,
  adminId: string,
  adminName: string
) {
  const vendor = await prisma.vendor.create({ data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: `Created vendor "${data.name}"`,
    entityType: 'Vendor',
    entityId: vendor.id,
  });

  return vendor;
}

export async function updateVendor(
  vendorId: string,
  data: UpdateVendorInput,
  adminId: string,
  adminName: string
) {
  const existing = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!existing) throw ApiError.notFound('Vendor not found');

  const updated = await prisma.vendor.update({ where: { id: vendorId }, data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: `Updated vendor "${existing.name}"`,
    entityType: 'Vendor',
    entityId: vendorId,
  });

  return updated;
}

export async function deleteVendor(vendorId: string, adminId: string, adminName: string) {
  const existing = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!existing) throw ApiError.notFound('Vendor not found');

  await prisma.vendor.delete({ where: { id: vendorId } });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: `Deleted vendor "${existing.name}"`,
    entityType: 'Vendor',
    entityId: vendorId,
  });
}

export async function addVendorProductMapping(
  vendorId: string,
  productFamilyId: string,
  adminId: string,
  adminName: string
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw ApiError.notFound('Vendor not found');

  const family = await prisma.productFamily.findUnique({ where: { id: productFamilyId } });
  if (!family) throw ApiError.notFound('Product family not found');

  const mapping = await prisma.vendorProductMapping.create({
    data: { vendorId, productFamilyId },
  }).catch(() => {
    throw ApiError.badRequest('Mapping already exists');
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: `Mapped product "${family.name}" to vendor "${vendor.name}"`,
    entityType: 'Vendor',
    entityId: vendorId,
  });

  return mapping;
}

export async function removeVendorProductMapping(
  vendorId: string,
  productFamilyId: string,
  adminId: string,
  adminName: string
) {
  const existing = await prisma.vendorProductMapping.findUnique({
    where: { vendorId_productFamilyId: { vendorId, productFamilyId } },
  });
  if (!existing) throw ApiError.notFound('Mapping not found');

  await prisma.vendorProductMapping.delete({
    where: { vendorId_productFamilyId: { vendorId, productFamilyId } },
  });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: `Removed product mapping from vendor`,
    entityType: 'Vendor',
    entityId: vendorId,
  });
}

// ─── Brand Config ────────────────────────────────────────

export async function getBrandConfig() {
  let config = await prisma.brandConfig.findFirst();
  if (!config) {
    config = await prisma.brandConfig.create({ data: {} });
  }
  return config;
}

export async function updateBrandConfig(
  data: UpdateBrandConfigInput,
  adminId: string,
  adminName: string
) {
  let config = await prisma.brandConfig.findFirst();
  const updated = config
    ? await prisma.brandConfig.update({ where: { id: config.id }, data })
    : await prisma.brandConfig.create({ data });

  await logActivity({
    userId: adminId,
    userName: adminName,
    actionType: 'CONTENT_EDIT',
    description: 'Updated brand configuration',
    entityType: 'BrandConfig',
    entityId: updated.id,
  });

  return updated;
}
