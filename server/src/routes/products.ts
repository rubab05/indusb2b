import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  productSchema,
  productUpdateSchema,
} from '../validators/catalog.validators.js';
import * as catalogService from '../services/catalog.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

// GET /api/products — public, with filters + pagination
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, total, page, limit } = await catalogService.getProducts(
      req.query as Record<string, string>
    );
    res.json(apiPaginated(data, total, page, limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug/related — public (must be before /:slug)
router.get('/:slug/related', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params['slug'] as string;
    const related = await catalogService.getRelatedProducts(slug);
    res.json(apiSuccess(related));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug — public
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params['slug'] as string;
    const product = await catalogService.getProductBySlug(slug);
    res.json(apiSuccess(product));
  } catch (err) {
    next(err);
  }
});

// POST /api/products — admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(productSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await catalogService.createProduct(req.body);
      res.status(201).json(apiSuccess(product));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/products/:slug — admin only
router.put(
  '/:slug',
  authenticate,
  requireAdmin,
  validate(productUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      const product = await catalogService.updateProduct(slug, req.body);
      res.json(apiSuccess(product));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/products/:slug — admin only
router.delete(
  '/:slug',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params['slug'] as string;
      await catalogService.deleteProduct(slug);
      res.json(apiSuccess({ message: 'Product deleted' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
