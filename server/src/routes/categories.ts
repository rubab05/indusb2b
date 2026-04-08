import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import {
  categorySchema,
  categoryUpdateSchema,
  reorderSchema,
} from '../validators/catalog.validators.js';
import * as catalogService from '../services/catalog.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

// GET /api/categories — public, published only
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await catalogService.getCategories();
    res.json(apiSuccess(categories));
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:slug — public
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params['slug'] as string;
    const category = await catalogService.getCategoryBySlug(slug);
    res.json(apiSuccess(category));
  } catch (err) {
    next(err);
  }
});

// POST /api/categories — admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(categorySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await catalogService.createCategory(req.body);
      res.status(201).json(apiSuccess(category));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/categories/reorder — admin only (must be before /:slug)
router.put(
  '/reorder',
  authenticate,
  requireAdmin,
  validate(reorderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await catalogService.reorderCategories(req.body.items);
      res.json(apiSuccess({ message: 'Categories reordered' }));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/categories/:slug — admin only
router.put(
  '/:slug',
  authenticate,
  requireAdmin,
  validate(categoryUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      const category = await catalogService.updateCategory(slug, req.body);
      res.json(apiSuccess(category));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/categories/:slug — admin only
router.delete(
  '/:slug',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      await catalogService.deleteCategory(slug);
      res.json(apiSuccess({ message: 'Category deleted' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
