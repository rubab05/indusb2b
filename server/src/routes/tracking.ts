import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved } from '../middleware/auth.js';
import * as commerceService from '../services/commerce.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

router.use(authenticate, requireApproved);

// GET /api/tracking
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shipments = await commerceService.getActiveShipments(req.user!.id);
    res.json(apiSuccess(shipments));
  } catch (err) {
    next(err);
  }
});

// GET /api/tracking/order/:orderId
router.get('/order/:orderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params['orderId'] as string;
    const tracking = await commerceService.getTrackingByOrderId(req.user!.id, orderId);
    res.json(apiSuccess(tracking));
  } catch (err) {
    next(err);
  }
});

export default router;
