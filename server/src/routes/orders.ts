import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/commerce.validators.js';
import * as commerceService from '../services/commerce.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireApproved);

// GET /api/orders
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = qs(req.query.status);
    const search = qs(req.query.search);
    const pageStr = qs(req.query.page);
    const limitStr = qs(req.query.limit);
    const result = await commerceService.getOrders(req.user!.id, {
      status,
      search,
      page: pageStr ? parseInt(pageStr) : undefined,
      limit: limitStr ? parseInt(limitStr) : undefined,
    });
    res.json(apiPaginated(result.orders, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const order = await commerceService.getOrderById(req.user!.id, id);
    res.json(apiSuccess(order));
  } catch (err) {
    next(err);
  }
});

// POST /api/orders
router.post(
  '/',
  validate(createOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await commerceService.createOrder(req.user!.id, req.body);
      res.status(201).json(apiSuccess(order));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/orders/:id/cancel
router.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const order = await commerceService.cancelOrder(req.user!.id, id);
    res.json(apiSuccess(order));
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/:id/reorder
router.post('/:id/reorder', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const order = await commerceService.reorder(req.user!.id, id);
    res.status(201).json(apiSuccess(order));
  } catch (err) {
    next(err);
  }
});

export default router;
