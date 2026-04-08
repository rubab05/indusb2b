import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validators.js';
import * as authService from '../services/auth.service.js';
import { apiSuccess } from '../utils/api-response.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await authService.login(email, password);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      res.json(apiSuccess(user));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email: string };
      const result = await authService.forgotPassword(email);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body as { token: string; password: string };
      const result = await authService.resetPassword(token, password);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.changePassword(req.user!.id, req.body);
      res.json(apiSuccess(result));
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/logout
router.post(
  '/logout',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // JWT is stateless — client discards token. Log the event server-side.
      const { prisma } = await import('../config/database.js');
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          userName: req.user!.companyName,
          actionType: 'LOGIN',
          description: `${req.user!.email} logged out`,
        },
      });
      res.json(apiSuccess({ message: 'Logged out successfully' }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
