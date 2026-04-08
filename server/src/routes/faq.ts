import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { faqSchema, faqUpdateSchema, reorderSchema } from '../validators/catalog.validators.js';
import * as catalogService from '../services/catalog.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

// GET /api/faq — public, optional ?category= filter
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const items = await catalogService.getFAQItems(category);
    res.json(apiSuccess(items));
  } catch (err) {
    next(err);
  }
});

// PUT /api/faq/reorder — admin only (before /:id)
router.put(
  '/reorder',
  authenticate,
  requireAdmin,
  validate(reorderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await catalogService.reorderFAQItems(req.body.items);
      res.json(apiSuccess({ message: 'FAQ items reordered' }));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/faq — admin only
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(faqSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await catalogService.createFAQItem(req.body);
      res.status(201).json(apiSuccess(item));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/faq/:id — admin only
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(faqUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params['id'] as string;
      const item = await catalogService.updateFAQItem(id, req.body);
      res.json(apiSuccess(item));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/faq/:id — admin only
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params['id'] as string;
      await catalogService.deleteFAQItem(id);
      res.json(apiSuccess({ message: 'FAQ item deleted' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
