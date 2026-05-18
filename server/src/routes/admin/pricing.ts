import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createPricingRuleSchema,
  updatePricingRuleSchema,
  createMOQRuleSchema,
  updateMOQRuleSchema,
  createBulkDiscountTierSchema,
  updateBulkDiscountTierSchema,
  createPriceListItemSchema,
  updatePriceListItemSchema,
} from '../../validators/admin.validators.js';
import * as adminService from '../../services/admin.service.js';
import { apiSuccess } from '../../utils/api-response.js';

const router = Router();

router.use(authenticate, requireAdmin);

// ─── Pricing Rules ───────────────────────────────────────

router.get('/rules', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await adminService.listPricingRules();
    res.json(apiSuccess(rules));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/rules',
  validate(createPricingRuleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const rule = await adminService.createPricingRule(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(rule));
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/rules/:id',
  validate(updatePricingRuleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const rule = await adminService.updatePricingRule(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(rule));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/rules/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.deletePricingRule(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

// ─── MOQ Rules ───────────────────────────────────────────

router.get('/moq', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await adminService.listMOQRules();
    res.json(apiSuccess(rules));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/moq',
  validate(createMOQRuleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const rule = await adminService.createMOQRule(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(rule));
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/moq/:id',
  validate(updateMOQRuleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const rule = await adminService.updateMOQRule(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(rule));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/moq/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.deleteMOQRule(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

// ─── Bulk Discount Tiers ─────────────────────────────────

router.get('/tiers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tiers = await adminService.listBulkDiscountTiers();
    res.json(apiSuccess(tiers));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/tiers',
  validate(createBulkDiscountTierSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const tier = await adminService.createBulkDiscountTier(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(tier));
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/tiers/:id',
  validate(updateBulkDiscountTierSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const tier = await adminService.updateBulkDiscountTier(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(tier));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/tiers/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.deleteBulkDiscountTier(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

// ─── Price List Items ─────────────────────────────────────

router.get('/price-list', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await adminService.listPriceListItems();
    res.json(apiSuccess(items));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/price-list',
  validate(createPriceListItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const item = await adminService.createPriceListItem(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(item));
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/price-list/:id',
  validate(updatePriceListItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const item = await adminService.updatePriceListItem(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(item));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/price-list/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.deletePriceListItem(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

export default router;
