import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { updateBrandConfigSchema } from '../../validators/admin.validators.js';
import * as adminService from '../../services/admin.service.js';
import { apiSuccess } from '../../utils/api-response.js';

const router = Router();

router.use(authenticate, requireAdmin);

// GET /api/admin/brand
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await adminService.getBrandConfig();
    res.json(apiSuccess(config));
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/brand
router.put(
  '/',
  validate(updateBrandConfigSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const config = await adminService.updateBrandConfig(req.body, admin.id, admin.companyName);
      res.json(apiSuccess(config));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
