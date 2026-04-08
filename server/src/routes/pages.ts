import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { pageSchema, pageUpdateSchema } from '../validators/catalog.validators.js';
import * as catalogService from '../services/catalog.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

// GET /api/pages — public, published only
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await catalogService.getPages();
    res.json(apiSuccess(pages));
  } catch (err) {
    next(err);
  }
});

// GET /api/pages/:slug — public
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params['slug'] as string;
    const page = await catalogService.getPageBySlug(slug);
    res.json(apiSuccess(page));
  } catch (err) {
    next(err);
  }
});

// POST /api/pages — admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(pageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = await catalogService.createPage(req.body);
      res.status(201).json(apiSuccess(page));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/pages/:slug — admin only
router.put(
  '/:slug',
  authenticate,
  requireAdmin,
  validate(pageUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      const page = await catalogService.updatePage(slug, req.body);
      res.json(apiSuccess(page));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/pages/:slug — admin only
router.delete(
  '/:slug',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      await catalogService.deletePage(slug);
      res.json(apiSuccess({ message: 'Page deleted' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
