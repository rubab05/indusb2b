import { Router, Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

// GET /api/brand — public, returns current brand config (no auth required)
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await adminService.getBrandConfig();
    res.json(apiSuccess(config));
  } catch (err) {
    next(err);
  }
});

export default router;
