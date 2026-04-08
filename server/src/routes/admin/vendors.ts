import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createVendorSchema,
  updateVendorSchema,
  vendorProductMappingSchema,
} from '../../validators/admin.validators.js';
import * as adminService from '../../services/admin.service.js';
import { apiSuccess, apiPaginated } from '../../utils/api-response.js';

const router = Router();

function qs(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

router.use(authenticate, requireAdmin);

// GET /api/admin/vendors
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.listVendors({
      status: qs(req.query.status),
      page: qs(req.query.page) ? parseInt(qs(req.query.page)!) : undefined,
      limit: qs(req.query.limit) ? parseInt(qs(req.query.limit)!) : undefined,
    });
    res.json(apiPaginated(result.vendors, result.total, result.page, result.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/vendors/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await adminService.getVendorById(req.params['id'] as string);
    res.json(apiSuccess(vendor));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/vendors
router.post(
  '/',
  validate(createVendorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const vendor = await adminService.createVendor(req.body, admin.id, admin.companyName);
      res.status(201).json(apiSuccess(vendor));
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/admin/vendors/:id
router.put(
  '/:id',
  validate(updateVendorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const vendor = await adminService.updateVendor(req.params['id'] as string, req.body, admin.id, admin.companyName);
      res.json(apiSuccess(vendor));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/vendors/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.deleteVendor(req.params['id'] as string, admin.id, admin.companyName);
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/vendors/:id/products
router.post(
  '/:id/products',
  validate(vendorProductMappingSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user!;
      const mapping = await adminService.addVendorProductMapping(
        req.params['id'] as string,
        req.body.productFamilyId,
        admin.id,
        admin.companyName
      );
      res.status(201).json(apiSuccess(mapping));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/vendors/:id/products/:productFamilyId
router.delete('/:id/products/:productFamilyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.user!;
    await adminService.removeVendorProductMapping(
      req.params['id'] as string,
      req.params['productFamilyId'] as string,
      admin.id,
      admin.companyName
    );
    res.json(apiSuccess(null));
  } catch (err) {
    next(err);
  }
});

export default router;
