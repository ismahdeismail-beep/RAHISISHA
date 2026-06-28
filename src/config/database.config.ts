import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rahisisha';
  try {
    await mongoose.connect(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 });
    logger.info('MongoDB connected successfully');
    mongoose.connection.on('error', (error) => logger.error('MongoDB connection error:', error));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected. Reconnecting...'));
    mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected successfully'));
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
}
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}