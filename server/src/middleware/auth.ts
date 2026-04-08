import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AccountType } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

interface JwtPayload {
  id: string;
  role: string;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const token = authHeader.slice(7);
    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireApproved(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const user = req.user;
  if (!user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  if (user.approvalStatus === 'PENDING') {
    return next(ApiError.forbidden('Account pending approval'));
  }
  if (user.approvalStatus === 'REJECTED' || user.approvalStatus === 'SUSPENDED') {
    return next(ApiError.forbidden('Account access restricted'));
  }
  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  if (req.user.role !== 'ADMIN') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
}

export function requireAccountType(type: AccountType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (req.user.accountType !== type) {
      return next(ApiError.forbidden(`This section is for ${type.toLowerCase()} accounts only`));
    }
    next();
  };
}
