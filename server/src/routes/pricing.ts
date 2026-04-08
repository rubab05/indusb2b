import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { quoteRequestSchema } from '../validators/commerce.validators.js';
import * as commerceService from '../services/commerce.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

router.use(authenticate, requireApproved);

// GET /api/pricing/price-list
router.get('/price-list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await commerceService.getPriceList(req.user!.id);
    res.json(apiSuccess(items));
  } catch (err) {
    next(err);
  }
});

// GET /api/pricing/moq-rules
router.get('/moq-rules', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await commerceService.getMOQRules();
    res.json(apiSuccess(rules));
  } catch (err) {
    next(err);
  }
});

// GET /api/pricing/bulk-discounts
router.get('/bulk-discounts', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tiers = await commerceService.getBulkDiscountTiers();
    res.json(apiSuccess(tiers));
  } catch (err) {
    next(err);
  }
});

// POST /api/pricing/quote-request
router.post(
  '/quote-request',
  validate(quoteRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quote = await commerceService.createQuoteRequest(req.user!.id, req.body);
      res.status(201).json(apiSuccess(quote));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/pricing/quote-requests
router.get('/quote-requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await commerceService.getQuoteRequests(req.user!.id);
    res.json(apiSuccess(quotes));
  } catch (err) {
    next(err);
  }
});

export default router;
