import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';

const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`
    ################################################
    🚀 Server listening on port: ${PORT} 🚀
    ################################################
    Environment: ${config.NODE_ENV}
    API URL: http://localhost:${PORT}/api
    Health Check: http://localhost:${PORT}/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});

export default server;
