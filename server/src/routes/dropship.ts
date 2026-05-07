import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved, requireAccountType } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { topUpSchema } from '../validators/commerce.validators.js';
import * as dropshipService from '../services/dropship.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

// All dropship routes require auth + approved + DROPSHIP account type
router.use(authenticate, requireApproved, requireAccountType('DROPSHIP'));

// GET /api/dropship/balance
router.get('/balance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balance = await dropshipService.getBalance(req.user!.id);
    res.json(apiSuccess(balance));
  } catch (err) {
    next(err);
  }
});

// GET /api/dropship/transactions/recent — must come before /transactions to avoid :id conflict
router.get(
  '/transactions/recent',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limitStr = qs(req.query.limit);
      const transactions = await dropshipService.getRecentTransactions(
        req.user!.id,
        limitStr ? parseInt(limitStr) : 10
      );
      res.json(apiSuccess(transactions));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/dropship/transactions
router.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = qs(req.query.type);
    const startDate = qs(req.query.startDate);
    const endDate = qs(req.query.endDate);
    const pageStr = qs(req.query.page);
    const limitStr = qs(req.query.limit);
    const result = await dropshipService.getTransactions(req.user!.id, {
      type,
      startDate,
      endDate,
      page: pageStr ? parseInt(pageStr) : undefined,
      limit: limitStr ? parseInt(limitStr) : undefined,
    });
    res.json(apiPaginated(result.transactions, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// POST /api/dropship/topup
router.post(
  '/topup',
  validate(topUpSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topUp = await dropshipService.submitTopUp(req.user!.id, req.body);
      res.status(201).json(apiSuccess({
        id: topUp.id,
        referenceNumber: topUp.reference,
        amount: topUp.amount,
        method: topUp.method,
        status: topUp.status,
        createdAt: topUp.createdAt,
      }));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/dropship/topups
router.get('/topups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageStr = qs(req.query.page);
    const limitStr = qs(req.query.limit);
    const result = await dropshipService.getUserTopUpRequests(req.user!.id, {
      page: pageStr ? parseInt(pageStr) : undefined,
      limit: limitStr ? parseInt(limitStr) : undefined,
    });
    res.json(apiPaginated(result.topUps, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/dropship/balance-history
router.get(
  '/balance-history',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const daysStr = qs(req.query.days);
      const history = await dropshipService.getBalanceHistory(
        req.user!.id,
        daysStr ? parseInt(daysStr) : 30
      );
      res.json(apiSuccess(history));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/dropship/statement
router.get('/statement', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = qs(req.query.startDate);
    const endDate = qs(req.query.endDate);
    if (!startDate || !endDate) {
      res.status(400).json({ success: false, error: 'startDate and endDate are required' });
      return;
    }
    const transactions = await dropshipService.getStatement(req.user!.id, startDate, endDate);
    res.json(apiSuccess(transactions));
  } catch (err) {
    next(err);
  }
});

export default router;
