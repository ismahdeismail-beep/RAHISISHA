import winston from 'winston'; import path from 'path'; import fs from 'fs';
const { combine, timestamp, json, errors, printf, colorize } = winston.format;
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) msg += ` ${JSON.stringify(metadata)}`;
  return msg;
});
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'rahisisha-platform', environment: process.env.NODE_ENV || 'development' },
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat) }),
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'error.log'), level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'combined.log'), maxsize: 5242880, maxFiles: 5 }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'exceptions.log') })],
  rejectionHandlers: [new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'rejections.log') })],
});
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });