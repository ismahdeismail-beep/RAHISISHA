import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from '../src/middleware/error.middleware';
import paymentRoutes from '../src/routes/payment.routes';
import webhookRoutes from '../src/routes/webhook.routes';
import authRoutes from '../src/routes/auth.routes';
import walletRoutes from '../src/routes/wallet.routes';
import escrowRoutes from '../src/routes/escrow.routes';
import subscriptionRoutes from '../src/routes/subscription.routes';
import analyticsRoutes from '../src/routes/analytics.routes';
import { logger } from '../src/utils/logger';

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

export default app;