import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import * as catalogService from '../../services/catalog.service.js';
import { apiSuccess } from '../../utils/api-response.js';

const router = Router();

// GET /api/admin/pages — all pages including drafts
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await catalogService.getPages(true);
    res.json(apiSuccess(pages));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/pages/:slug — any page by slug regardless of status
router.get('/:slug', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params['slug'] as string;
    const page = await catalogService.getPageBySlug(slug, true);
    res.json(apiSuccess(page));
  } catch (err) {
    next(err);
  }
});

export default router;
