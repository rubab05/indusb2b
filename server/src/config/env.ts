import { config } from 'dotenv';

config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] ?? '7d',
  PORT: parseInt(process.env['PORT'] ?? '4000', 10),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  FRONTEND_URL: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
  SMTP_HOST: process.env['SMTP_HOST'] ?? '',
  SMTP_PORT: parseInt(process.env['SMTP_PORT'] ?? '587', 10),
  SMTP_USER: process.env['SMTP_USER'] ?? '',
  SMTP_PASS: process.env['SMTP_PASS'] ?? '',
  SMTP_FROM: process.env['SMTP_FROM'] ?? 'noreply@homatz.com',
  UPLOAD_DIR: process.env['UPLOAD_DIR'] ?? './uploads',
  MAX_FILE_SIZE: parseInt(process.env['MAX_FILE_SIZE'] ?? '5242880', 10),
  isDev: (process.env['NODE_ENV'] ?? 'development') === 'development',
  isProd: process.env['NODE_ENV'] === 'production',
};