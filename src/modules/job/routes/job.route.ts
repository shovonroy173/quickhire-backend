import express from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { 
  createJobSchema, 
  updateJobSchema, 
  jobIdSchema,
  jobQuerySchema 
} from '../validations/job.validation';

const router = express.Router();
const jobController = new JobController();

/**
 * Public routes
 */
router.get('/', validate(jobQuerySchema, 'query'), jobController.getAllJobs);
router.get('/featured', jobController.getFeaturedJobs);
router.get('/:id', validate(jobIdSchema, 'params'), jobController.getJobById);

/**
 * Protected routes (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createJobSchema),
  jobController.createJob
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(jobIdSchema, 'params'),
  validate(updateJobSchema),
  jobController.updateJob
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(jobIdSchema, 'params'),
  jobController.deleteJob
);

export default router;
