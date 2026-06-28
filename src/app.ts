import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.config';
import { connectRedis } from './config/redis.config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './routes/webhook.routes';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import escrowRoutes from './routes/escrow.routes';
import subscriptionRoutes from './routes/subscription.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app: Application = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000),
  },
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Admin dashboard SPA fallback — serve index.html for any /admin/* route not matched by static files
const adminIndex = path.join(process.cwd(), 'public', 'admin', 'index.html');
app.get('/admin/*', (req: Request, res: Response) => {
  res.sendFile(adminIndex, (err) => {
    if (err) res.status(404).json({ success: false, error: 'Admin dashboard not built yet' });
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

app.use('/v1/auth', authRoutes);
app.use('/v1/payments', paymentRoutes);
app.use('/v1/wallet', walletRoutes);
app.use('/v1/escrow', escrowRoutes);
app.use('/v1/subscriptions', subscriptionRoutes);
app.use('/v1/analytics', analyticsRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/docs', (req: Request, res: Response) => {
  res.redirect('https://docs.rahisisha.com');
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', path: req.path, method: req.method });
});

app.use(errorHandler);

process.on('SIGTERM', async () => { logger.info('SIGTERM received, shutting down gracefully'); process.exit(0); });
process.on('SIGINT', async () => { logger.info('SIGINT received, shutting down gracefully'); process.exit(0); });

async function startServer() {
  const PORT = process.env.PORT || 3000;
  try {
    await connectDatabase();
    await connectRedis();
  } catch (error) {
    logger.warn('Database connections failed, server will start without DB:', error);
  }
  app.listen(PORT, () => {
    logger.info(`RAHISISHA server running on port ${PORT}`);
    logger.info(`API Documentation: http://localhost:${PORT}/docs`);
    logger.info(`Health Check: http://localhost:${PORT}/health`);
  });
}

// Only start the server if this file is run directly (not imported as a module)
if (require.main === module) {
  startServer();
}

export default app;