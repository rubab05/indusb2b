import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  uploadMiddleware,
  processUpload,
  processUploads,
  deleteUpload,
  getMediaItems,
} from '../services/upload.service.js';
import { apiSuccess, apiPaginated } from '../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

function getBaseUrl(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}

// GET /api/media — list media (admin only)
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getMediaItems({
      search: qs(req.query.search),
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.items, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// POST /api/media/upload — upload single image
router.post(
  '/upload',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware.single('file')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }
      const item = await processUpload(req.file, getBaseUrl(req));
      res.status(201).json(apiSuccess(item));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/media/upload-multiple — upload up to 10 images
router.post(
  '/upload-multiple',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware.array('files', 10)(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, error: 'No files uploaded' });
        return;
      }
      const items = await processUploads(files, getBaseUrl(req));
      res.status(201).json(apiSuccess(items));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/media/:id — delete media item (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUpload(req.params['id'] as string);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

export default router;
