import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  updateOrderStatusSchema,
  assignOrderSchema,
  addOrderNoteSchema,
  bulkUpdateOrderStatusSchema,
  createReturnSchema,
  updateReturnStatusSchema,
  addReturnNoteSchema,
  activityLogFilterSchema,
} from '../../validators/admin.validators.js';
import * as opsService from '../../services/operations.service.js';
import { apiSuccess, apiPaginated } from '../../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

function qi(val: unknown): number | undefined {
  const s = qs(val);
  return s ? parseInt(s) : undefined;
}

router.use(authenticate, requireAdmin);

// ─── Ops Stats ───────────────────────────────────────────

// GET /api/admin/operations/stats
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await opsService.getOpsStats();
    res.json(apiSuccess(stats));
  } catch (err) {
    next(err);
  }
});

// ─── Orders ──────────────────────────────────────────────

// GET /api/admin/operations/orders
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await opsService.getAllOrders({
      status: qs(req.query.status),
      assignedTo: qs(req.query.assignedTo),
      search: qs(req.query.search),
      page: qi(req.query.page),
      limit: qi(req.query.limit),
    });
    res.json(apiPaginated(result.orders, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/operations/orders/:id
router.get('/orders/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await opsService.getAdminOrderById(req.params['id'] as string);
    res.json(apiSuccess(order));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/operations/orders/:id/status
router.patch(
  '/orders/:id/status',
  validate(updateOrderStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const order = await opsService.updateOrderStatus(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(order));
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/admin/operations/orders/:id/assign
router.patch(
  '/orders/:id/assign',
  validate(assignOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const order = await opsService.assignOrder(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(order));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/operations/orders/:id/notes
router.post(
  '/orders/:id/notes',
  validate(addOrderNoteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const order = await opsService.addOrderInternalNote(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(order));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/operations/orders/bulk-status
router.post(
  '/orders/bulk-status',
  validate(bulkUpdateOrderStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const results = await opsService.bulkUpdateOrderStatus(req.body, admin.id, admin.companyName);
      res.json(apiSuccess(results));
    } catch (err) {
      next(err);
    }
  }
);

// ─── Returns ─────────────────────────────────────────────

// GET /api/admin/operations/returns
router.get('/returns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await opsService.listReturns({
      status: qs(req.query.status),
      page: qi(req.query.page),
      limit: qi(req.query.limit),
    });
    res.json(apiPaginated(result.returns, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/operations/returns/:id
router.get('/returns/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ret = await opsService.getReturnById(req.params['id'] as string);
    res.json(apiSuccess(ret));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/operations/returns
router.post(
  '/returns',
  validate(createReturnSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const ret = await opsService.createReturn(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(ret));
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/admin/operations/returns/:id/status
router.patch(
  '/returns/:id/status',
  validate(updateReturnStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const ret = await opsService.updateReturnStatus(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(ret));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/operations/returns/:id/notes
router.post(
  '/returns/:id/notes',
  validate(addReturnNoteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const note = await opsService.addReturnNote(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(note));
    } catch (err) {
      next(err);
    }
  }
);

// ─── Activity Log ─────────────────────────────────────────

// GET /api/admin/operations/logs/export  (before /logs to avoid param collision)
router.get('/logs/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csv = await opsService.exportActivityLogCSV({
      actionType: qs(req.query.actionType),
      userId: qs(req.query.userId),
      startDate: qs(req.query.startDate),
      endDate: qs(req.query.endDate),
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="activity-log.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/operations/logs
router.get('/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = activityLogFilterSchema.parse(req.query);
    const result = await opsService.getActivityLog(parsed);
    res.json(apiPaginated(result.logs, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

export default router;
