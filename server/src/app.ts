import express from 'express';
import cors from 'cors';
import { corsConfig } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import pageRoutes from './routes/pages.js';
import faqRoutes from './routes/faq.js';

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.use('/api/orders', orderRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/tracking', trackingRoutes);
// app.use('/api/support', supportRoutes);
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/dropship', dropshipRoutes);
// app.use('/api/admin', adminRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;