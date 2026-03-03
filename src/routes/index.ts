import express from 'express';
import jobRoutes from '../modules/job/routes/job.route';
import applicationRoutes from '../modules/application/routes/application.route';
import authRoutes from '../modules/auth/routes/auth.route';
import userRoutes from '../modules/user/routes/user.route';
import { config } from '../config/env';

const router = express.Router(); 

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API routes
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// API documentation route (if using swagger)
if (config.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const { swaggerSpec } = require('../config/swagger');
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default router;
