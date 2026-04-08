import { z } from 'zod';

// ─── Partner Applications ────────────────────────────────

export const reviewApplicationSchema = z.object({
  adminNotes: z.string().optional(),
});

// ─── Partner Management ──────────────────────────────────

export const suspendPartnerSchema = z.object({
  reason: z.string().optional(),
});

// ─── Pricing Rules ───────────────────────────────────────

export const createPricingRuleSchema = z.object({
  categoryId: z.string().optional(),
  productFamilySlug: z.string().optional(),
  visibleToWholesale: z.boolean().default(true),
  visibleToDropship: z.boolean().default(true),
});

export const updatePricingRuleSchema = createPricingRuleSchema.partial();

// ─── MOQ Rules ───────────────────────────────────────────

export const createMOQRuleSchema = z.object({
  categoryId: z.string().optional(),
  productSlug: z.string().optional(),
  minQuantity: z.number().int().positive(),
  unit: z.string().default('units'),
  notes: z.string().optional(),
});

export const updateMOQRuleSchema = createMOQRuleSchema.partial();

// ─── Bulk Discount Tiers ─────────────────────────────────

export const createBulkDiscountTierSchema = z.object({
  tierName: z.string().min(1),
  minQty: z.number().int().positive(),
  maxQty: z.number().int().positive().optional(),
  discountPercent: z.number().min(0).max(100),
});

export const updateBulkDiscountTierSchema = createBulkDiscountTierSchema.partial();

// ─── Vendors ─────────────────────────────────────────────

export const createVendorSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateVendorSchema = createVendorSchema.partial();

export const vendorProductMappingSchema = z.object({
  productFamilyId: z.string().min(1),
});

// ─── Brand Config ────────────────────────────────────────

export const updateBrandConfigSchema = z.object({
  brandName: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().nullable(),
  logoSecondaryUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  emailHeaderHtml: z.string().optional().nullable(),
  invoiceHeaderHtml: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
});

// ─── Order Workflow ──────────────────────────────────────

export const updateOrderStatusSchema = z.object({
  status: z.enum(['NEW', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional(),
});

export const assignOrderSchema = z.object({
  assignedTo: z.string().min(1),
});

export const addOrderNoteSchema = z.object({
  text: z.string().min(1),
});

export const bulkUpdateOrderStatusSchema = z.object({
  orderIds: z.array(z.string()).min(1),
  status: z.enum(['NEW', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional(),
});

// ─── Returns ─────────────────────────────────────────────

export const createReturnSchema = z.object({
  orderId: z.string().min(1),
  partnerName: z.string().min(1),
  reason: z.enum(['DAMAGED', 'WRONG_ITEM', 'MISSING_ITEM', 'QUALITY_ISSUE', 'OTHER']),
  description: z.string().min(10),
});

export const updateReturnStatusSchema = z.object({
  status: z.enum(['REPORTED', 'INVESTIGATING', 'RESOLVED', 'REJECTED']),
  resolutionType: z.enum(['REFUND', 'REPLACEMENT', 'CREDIT', 'REJECTED']).optional(),
  resolutionNotes: z.string().optional(),
});

export const addReturnNoteSchema = z.object({
  body: z.string().min(1),
});

// ─── Activity Log ────────────────────────────────────────

export const activityLogFilterSchema = z.object({
  actionType: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// ─── Admin Support ───────────────────────────────────────

export const assignTicketSchema = z.object({
  assignedTo: z.string().min(1),
});

export const addTicketInternalNoteSchema = z.object({
  body: z.string().min(1),
});

export const setTicketPrioritySchema = z.object({
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
});

export const adminReplyTicketSchema = z.object({
  body: z.string().min(1),
});

// ─── Top-Up Admin ────────────────────────────────────────

export const rejectTopUpSchema = z.object({
  reason: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────

export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;
export type CreatePricingRuleInput = z.infer<typeof createPricingRuleSchema>;
export type UpdatePricingRuleInput = z.infer<typeof updatePricingRuleSchema>;
export type CreateMOQRuleInput = z.infer<typeof createMOQRuleSchema>;
export type UpdateMOQRuleInput = z.infer<typeof updateMOQRuleSchema>;
export type CreateBulkDiscountTierInput = z.infer<typeof createBulkDiscountTierSchema>;
export type UpdateBulkDiscountTierInput = z.infer<typeof updateBulkDiscountTierSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type UpdateBrandConfigInput = z.infer<typeof updateBrandConfigSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AssignOrderInput = z.infer<typeof assignOrderSchema>;
export type AddOrderNoteInput = z.infer<typeof addOrderNoteSchema>;
export type BulkUpdateOrderStatusInput = z.infer<typeof bulkUpdateOrderStatusSchema>;
export type CreateReturnInput = z.infer<typeof createReturnSchema>;
export type UpdateReturnStatusInput = z.infer<typeof updateReturnStatusSchema>;
export type AddReturnNoteInput = z.infer<typeof addReturnNoteSchema>;
export type ActivityLogFilterInput = z.infer<typeof activityLogFilterSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
export type AddTicketInternalNoteInput = z.infer<typeof addTicketInternalNoteSchema>;
export type SetTicketPriorityInput = z.infer<typeof setTicketPrioritySchema>;
export type AdminReplyTicketInput = z.infer<typeof adminReplyTicketSchema>;
