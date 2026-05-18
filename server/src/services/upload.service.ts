import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

// ─── Allowed MIME types ──────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

// ─── Multer Config ───────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${randomUUID()}${ext}`;
    cb(null, unique);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Only image files and PDFs are allowed (jpeg, png, gif, webp, svg, pdf). Received: ${file.mimetype}`
      )
    );
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE },
});

// ─── Process & Save to DB ────────────────────────────────

export async function processUpload(
  file: Express.Multer.File,
  baseUrl: string
): Promise<{
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}> {
  const url = `${baseUrl}/uploads/${file.filename}`;

  const record = await prisma.mediaItem.create({
    data: {
      filename: file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
    },
  });

  return record;
}

export async function processUploads(
  files: Express.Multer.File[],
  baseUrl: string
) {
  return Promise.all(files.map((f) => processUpload(f, baseUrl)));
}

// ─── Delete ──────────────────────────────────────────────

export async function deleteUpload(mediaId: string): Promise<void> {
  const item = await prisma.mediaItem.findUnique({ where: { id: mediaId } });
  if (!item) throw ApiError.notFound('Media item not found');

  // Delete file from disk
  const filename = path.basename(item.url);
  const filePath = path.join(env.UPLOAD_DIR, filename);

  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be gone — continue with DB deletion
  }

  await prisma.mediaItem.delete({ where: { id: mediaId } });
}

// ─── List ────────────────────────────────────────────────

export async function getMediaItems(filters: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 30));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.search) {
    where.filename = { contains: filters.search, mode: 'insensitive' };
  }

  const [items, total] = await Promise.all([
    prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.mediaItem.count({ where }),
  ]);

  return { items, total, page, limit };
}
