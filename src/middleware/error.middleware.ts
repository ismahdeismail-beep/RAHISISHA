import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { PaymentProviderError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '../types';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error('Error:', { message: err.message, stack: err.stack, path: req.path, method: req.method });
  let statusCode = 500, errorCode = 'INTERNAL_ERROR', details: Record<string, any> | undefined;
  if (err instanceof PaymentProviderError) { statusCode = err.statusCode; errorCode = err.providerCode || 'PAYMENT_ERROR'; }
  else if (err instanceof ValidationError) { statusCode = err.statusCode; errorCode = 'VALIDATION_ERROR'; details = err.fields; }
  else if (err instanceof NotFoundError) { statusCode = err.statusCode; errorCode = 'NOT_FOUND'; }
  else if (err instanceof UnauthorizedError) { statusCode = err.statusCode; errorCode = 'UNAUTHORIZED'; }
  else if (err instanceof ForbiddenError) { statusCode = err.statusCode; errorCode = 'FORBIDDEN'; }
  else if (err.name === 'ValidationError') { statusCode = 400; errorCode = 'MONGOOSE_VALIDATION_ERROR'; }
  else if (err.name === 'CastError') { statusCode = 400; errorCode = 'INVALID_ID_FORMAT'; }
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) { statusCode = 409; errorCode = 'DUPLICATE_ENTRY'; }
  res.status(statusCode).json({ success: false, error: { code: errorCode, message: err.message || 'An unexpected error occurred', details }, meta: { timestamp: new Date().toISOString(), requestId: req.headers['x-request-id'] || 'unknown' } });
}