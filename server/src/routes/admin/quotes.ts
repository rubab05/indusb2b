import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as commerceService from '../../services/commerce.service.js';
import { apiSuccess } from '../../utils/api-response.js';

const router = Router();

router.use(authenticate, requireAdmin);

const respondSchema = z.object({
  response: z.string().min(1, 'Response is required'),
});

// GET /api/admin/quotes — list all quote requests with partner info
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await commerceService.getAllQuoteRequests();
    res.json(apiSuccess(quotes));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/quotes/:id/respond — send a response to a quote request
router.post(
  '/:id/respond',
  validate(respondSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const adminName = admin.companyName ?? admin.email;
      const quote = await commerceService.respondToQuoteRequest(
        req.params['id'] as string,
        admin.id,
        adminName,
        req.body.response,
      );
      res.json(apiSuccess(quote));
    } catch (err) {
      next(err);
    }
  },
);

export default router;
