import express from 'express';
import cors from 'cors';
import { corsConfig } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes will be mounted here by subsequent tasks:
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/products', productRoutes);
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