import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';
import type { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validators.js';

// In-memory store for password reset tokens (dev only — replace with DB model in production)
const resetTokens = new Map<string, { userId: string; expiresAt: Date }>();

function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

function safeUser(user: User) {
  const { passwordHash: _pw, ...safe } = user;
  return safe;
}

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        companyName: data.companyName,
        accountType: data.accountType,
        approvalStatus: 'PENDING',
        role: 'PARTNER',
        profile: {
          create: {
            contactName: data.contactName,
            contactEmail: data.email,
            contactPhone: data.contactPhone,
            companyRegNumber: data.companyRegNumber,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            postcode: data.postcode,
            country: data.country,
            websiteUrl: data.websiteUrl || null,
            platform: data.platform,
            revenueRange: data.revenueRange,
            estimatedMonthlyVolume: data.estimatedMonthlyVolume,
          },
        },
        applications: {
          create: {
            accountType: data.accountType,
            status: 'PENDING',
            businessType: data.businessType,
            categoriesOfInterest: data.categoriesOfInterest ?? [],
          },
        },
      },
    });

    return created;
  });

  const token = generateToken(user);

  logger.info(`New partner registered: ${user.email} (${user.accountType})`);

  return { user: safeUser(user), token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user);

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      userName: user.companyName,
      actionType: 'LOGIN',
      description: `${user.email} logged in`,
    },
  });

  return { user: safeUser(user), token };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  const { passwordHash: _pw, ...safe } = user;
  return safe;
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  resetTokens.set(token, { userId: user.id, expiresAt });

  if (env.isDev) {
    logger.info(`[DEV] Password reset token for ${email}: ${token}`);
  }

  return { message: 'If an account exists with this email, a reset link has been sent.' };
}

export async function resetPassword(token: string, newPassword: string) {
  const entry = resetTokens.get(token);
  if (!entry || entry.expiresAt < new Date()) {
    resetTokens.delete(token);
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: entry.userId },
    data: { passwordHash },
  });

  resetTokens.delete(token);

  return { message: 'Password has been reset successfully' };
}

export async function changePassword(userId: string, data: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!valid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { message: 'Password changed successfully' };
}
