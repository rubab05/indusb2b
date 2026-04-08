import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireApproved } from '../middleware/auth.js';
import * as commerceService from '../services/commerce.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireApproved);

// GET /api/invoices
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = qs(req.query.status);
    const pageStr = qs(req.query.page);
    const limitStr = qs(req.query.limit);
    const result = await commerceService.getInvoices(req.user!.id, {
      status,
      page: pageStr ? parseInt(pageStr) : undefined,
      limit: limitStr ? parseInt(limitStr) : undefined,
    });
    res.json(apiPaginated(result.invoices, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/invoices/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const invoice = await commerceService.getInvoiceById(req.user!.id, id);
    res.json(apiSuccess(invoice));
  } catch (err) {
    next(err);
  }
});

// GET /api/invoices/:id/download
router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    await commerceService.getInvoiceById(req.user!.id, id);
    const buffer = await commerceService.generateInvoicePDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;
