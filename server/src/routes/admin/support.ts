import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  assignTicketSchema,
  addTicketInternalNoteSchema,
  setTicketPrioritySchema,
  adminReplyTicketSchema,
} from '../../validators/admin.validators.js';
import * as opsService from '../../services/operations.service.js';
import { apiSuccess, apiPaginated } from '../../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireAdmin);

// GET /api/admin/support
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await opsService.getAllTickets({
      status: qs(req.query.status),
      priority: qs(req.query.priority),
      assignedTo: qs(req.query.assignedTo),
      category: qs(req.query.category),
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.tickets, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/support/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await opsService.getAdminTicketById(req.params['id'] as string);
    res.json(apiSuccess(ticket));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/support/:id/assign
router.patch(
  '/:id/assign',
  validate(assignTicketSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const ticket = await opsService.assignTicket(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(ticket));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/support/:id/notes
router.post(
  '/:id/notes',
  validate(addTicketInternalNoteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const note = await opsService.addTicketInternalNote(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(note));
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/admin/support/:id/priority
router.patch(
  '/:id/priority',
  validate(setTicketPrioritySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const ticket = await opsService.setTicketPriority(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(ticket));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/support/:id/reply
router.post(
  '/:id/reply',
  validate(adminReplyTicketSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const message = await opsService.adminReplyToTicket(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(message));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/support/:id/close
router.post('/:id/close', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    const ticket = await opsService.adminCloseTicket(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(ticket));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/support/:id/reopen
router.post('/:id/reopen', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    const ticket = await opsService.adminReopenTicket(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(ticket));
  } catch (err) {
    next(err);
  }
});

export default router;
