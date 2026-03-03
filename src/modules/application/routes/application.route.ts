import express from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  createApplicationSchema,
  applicationIdSchema,
  updateApplicationStatusSchema,
} from '../validations/application.validation';

const router = express.Router();
const applicationController = new ApplicationController();

/**
 * Public routes
 */
router.post(
  '/',
  validate(createApplicationSchema),
  applicationController.createApplication
);

/**
 * Protected routes
 */
router.get(
  '/me',
  authenticate,
  applicationController.getMyApplications
);

/**
 * Protected routes (Admin only)
 */
router.get(
  '/job/:jobId',
  authenticate,
  authorize('admin'),
  applicationController.getJobApplications
);

router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(applicationIdSchema, 'params'),
  applicationController.getApplicationById
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate(applicationIdSchema, 'params'),
  validate(updateApplicationStatusSchema),
  applicationController.updateStatus
);

export default router;
