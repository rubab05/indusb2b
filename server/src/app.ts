import express from 'express';
import cors from 'cors';
import path from 'path';
import { corsConfig } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import pageRoutes from './routes/pages.js';
import faqRoutes from './routes/faq.js';
import orderRoutes from './routes/orders.js';
import invoiceRoutes from './routes/invoices.js';
import trackingRoutes from './routes/tracking.js';
import supportRoutes from './routes/support.js';
import pricingRoutes from './routes/pricing.js';
import dropshipRoutes from './routes/dropship.js';
import adminPartnersRoutes from './routes/admin/partners.js';
import adminPricingRoutes from './routes/admin/pricing.js';
import adminVendorsRoutes from './routes/admin/vendors.js';
import adminBrandRoutes from './routes/admin/brand.js';
import adminOperationsRoutes from './routes/admin/operations.js';
import adminSupportRoutes from './routes/admin/support.js';
import adminTopUpsRoutes from './routes/admin/topups.js';
import adminPagesRoutes from './routes/admin/pages.js';
import adminQuotesRoutes from './routes/admin/quotes.js';
import mediaRoutes from './routes/media.js';
import brandRoutes from './routes/brand.js';
import contactRoutes from './routes/contact.js';

const app = express();

// Middleware
app.use(cors(corsConfig));
//app.options('/api/auth/login', cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Catalog routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/faq', faqRoutes);

// Partner & commerce routes
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/dropship', dropshipRoutes);

// Media routes
app.use('/api/media', mediaRoutes);

// Public brand config (no auth — used by frontend to apply brand settings for all users)
app.use('/api/brand', brandRoutes);

// Public contact / enquiry form (no auth required)
app.use('/api/contact', contactRoutes);

// Admin routes
app.use('/api/admin/partners', adminPartnersRoutes);
app.use('/api/admin/pricing', adminPricingRoutes);
app.use('/api/admin/vendors', adminVendorsRoutes);
app.use('/api/admin/brand', adminBrandRoutes);
app.use('/api/admin/operations', adminOperationsRoutes);
app.use('/api/admin/support', adminSupportRoutes);
app.use('/api/admin/topups', adminTopUpsRoutes);
app.use('/api/admin/pages', adminPagesRoutes);
app.use('/api/admin/quotes', adminQuotesRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;