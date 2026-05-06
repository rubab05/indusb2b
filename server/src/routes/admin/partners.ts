import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { reviewApplicationSchema, suspendPartnerSchema } from '../../validators/admin.validators.js';
import * as adminService from '../../services/admin.service.js';
import * as commerceService from '../../services/commerce.service.js';
import { apiSuccess, apiPaginated } from '../../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireAdmin);

// ─── Applications ────────────────────────────────────────

// GET /api/admin/partners/applications
router.get('/applications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.listApplications({
      status: qs(req.query.status),
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.applications, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/partners/applications/:id
router.get('/applications/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const application = await adminService.getApplicationById(id);
    res.json(apiSuccess(application));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/partners/applications/:id/approve
router.post(
  '/applications/:id/approve',
  validate(reviewApplicationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const result = await adminService.approveApplication(req.params['id'] as string, admin.id, admin.companyName, req.body);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/partners/applications/:id/reject
router.post(
  '/applications/:id/reject',
  validate(reviewApplicationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const result = await adminService.rejectApplication(req.params['id'] as string, admin.id, admin.companyName, req.body);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// ─── Partners ────────────────────────────────────────────

// GET /api/admin/partners
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.listPartners({
      status: qs(req.query.status),
      accountType: qs(req.query.accountType),
      search: qs(req.query.search),
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.partners, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/partners/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partner = await adminService.getPartnerDetail(req.params['id'] as string);
    res.json(apiSuccess(partner));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/partners/:id/suspend
router.post(
  '/:id/suspend',
  validate(suspendPartnerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const result = await adminService.suspendPartner(req.params['id'] as string, admin.id, admin.companyName);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/partners/:id/reactivate
router.post('/:id/reactivate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    const result = await adminService.reactivatePartner(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(result));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/partners/:id/orders
router.get('/:id/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partnerId = req.params['id'] as string;
    const result = await commerceService.getOrders(partnerId, { limit: 20 });
    res.json(apiSuccess(result.orders));
  } catch (err) {
    next(err);
  }
});

export default router;
