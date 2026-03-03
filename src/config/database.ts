import mongoose from 'mongoose';
import { config } from './env';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connectionOptions = {
      autoIndex: config.NODE_ENV === 'development',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(config.DATABASE_URL, connectionOptions);
    
    logger.info('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
