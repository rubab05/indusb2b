import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { rejectTopUpSchema } from '../../validators/admin.validators.js';
import * as opsService from '../../services/operations.service.js';
import { apiSuccess, apiPaginated } from '../../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireAdmin);

// GET /api/admin/topups
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await opsService.listPendingTopUps({
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.topUps, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/topups/:id/confirm
router.post('/:id/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    const balance = await opsService.confirmTopUpAdmin(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(balance));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/topups/:id/reject
router.post(
  '/:id/reject',
  validate(rejectTopUpSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const topUp = await opsService.rejectTopUpAdmin(req.params['id'] as string, admin.id, admin.companyName);
      res.json(apiSuccess(topUp));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
