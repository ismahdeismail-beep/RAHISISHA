import Redis from 'ioredis';
import { logger } from '../utils/logger';
let redisClient: Redis | null = null;

export async function connectRedis(): Promise<Redis> {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3, enableReadyCheck: true,
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
  });
  redisClient.on('connect', () => logger.info('Redis connected successfully'));
  redisClient.on('error', (error) => logger.error('Redis connection error:', error));
  redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));
  return redisClient;
}
export function getRedisClient(): Redis {
  if (!redisClient) throw new Error('Redis client not initialized. Call connectRedis() first.');
  return redisClient;
}
export async function disconnectRedis(): Promise<void> {
  if (redisClient) { await redisClient.quit(); redisClient = null; logger.info('Redis disconnected'); }
}