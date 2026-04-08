import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTicketSchema, ticketMessageSchema } from '../validators/commerce.validators.js';
import * as supportService from '../services/support.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireApproved);

// GET /api/support
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = qs(req.query.status);
    const pageStr = qs(req.query.page);
    const limitStr = qs(req.query.limit);
    const result = await supportService.getTickets(req.user!.id, {
      status,
      page: pageStr ? parseInt(pageStr) : undefined,
      limit: limitStr ? parseInt(limitStr) : undefined,
    });
    res.json(apiPaginated(result.tickets, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/support/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const ticket = await supportService.getTicketById(req.user!.id, id);
    res.json(apiSuccess(ticket));
  } catch (err) {
    next(err);
  }
});

// POST /api/support
router.post(
  '/',
  validate(createTicketSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await supportService.createTicket(req.user!.id, req.body);
      res.status(201).json(apiSuccess(ticket));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/support/:id/messages
router.post(
  '/:id/messages',
  validate(ticketMessageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params['id'] as string;
      const message = await supportService.addMessage(req.user!.id, id, req.body);
      res.status(201).json(apiSuccess(message));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/support/:id/close
router.post('/:id/close', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const ticket = await supportService.closeTicket(req.user!.id, id);
    res.json(apiSuccess(ticket));
  } catch (err) {
    next(err);
  }
});

export default router;
