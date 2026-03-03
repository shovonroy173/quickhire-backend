import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { catchAsync } from '../../../common/utils/catchAsync';
import { ApiResponse } from '../../../common/utils/ApiResponse';
import { ApiError } from '../../../common/utils/ApiError';
import { AuthRequest } from '../../../middlewares/auth.middleware';

export class JobController {
  private jobService = new JobService();

  /**
   * @swagger
   * /jobs:
   *   get:
   *     summary: Get all jobs with pagination and filters
   *     tags: [Jobs]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer }
   *       - in: query
   *         name: limit
   *         schema: { type: integer }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: category
   *         schema: { type: string }
   *       - in: query
   *         name: location
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: List of jobs
   */
  getAllJobs = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, search, category, location, type, featured } = req.query;
    
    const filters: any = {};
    if (search) filters.search = search as string;
    if (category) filters.category = category as string;
    if (location) filters.location = location as string;
    if (type) filters.type = type as string;
    if (featured) filters.featured = featured === 'true';

    const result = await this.jobService.findAll(
      filters,
      Number(page) || 1,
      Number(limit) || 20
    );

    res.status(200).json(
      ApiResponse.success(result.data, 'Jobs retrieved successfully', {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total: result.total,
        pages: Math.ceil(result.total / (Number(limit) || 20)),
      })
    );
  });

  /**
   * @swagger
   * /jobs/{id}:
   *   get:
   *     summary: Get job by ID
   *     tags: [Jobs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Job details
   *       404:
   *         description: Job not found
   */
  getJobById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const job = await this.jobService.findById(req.params.id);
    
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    // Increment view count
    await this.jobService.incrementViews(req.params.id);

    res.status(200).json(
      ApiResponse.success(job, 'Job retrieved successfully')
    );
  });

  /**
   * @swagger
   * /jobs:
   *   post:
   *     summary: Create a new job (Admin only)
   *     tags: [Jobs]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Job'
   *     responses:
   *       201:
   *         description: Job created successfully
   *       401:
   *         description: Unauthorized
   */
  createJob = catchAsync(async (req: AuthRequest, res: Response) => {
    const job = await this.jobService.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json(
      ApiResponse.success(job, 'Job created successfully')
    );
  });

  /**
   * @swagger
   * /jobs/{id}:
   *   put:
   *     summary: Update job (Admin only)
   *     tags: [Jobs]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Job'
   *     responses:
   *       200:
   *         description: Job updated successfully
   *       404:
   *         description: Job not found
   */
  updateJob = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const job = await this.jobService.update(req.params.id, req.body);
    
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    res.status(200).json(
      ApiResponse.success(job, 'Job updated successfully')
    );
  });

  /**
   * @swagger
   * /jobs/{id}:
   *   delete:
   *     summary: Delete job (Admin only)
   *     tags: [Jobs]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       204:
   *         description: Job deleted successfully
   *       404:
   *         description: Job not found
   */
  deleteJob = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const job = await this.jobService.delete(req.params.id);
    
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    res.status(204).json(
      ApiResponse.success(null, 'Job deleted successfully')
    );
  });

  /**
   * @swagger
   * /jobs/featured:
   *   get:
   *     summary: Get featured jobs
   *     tags: [Jobs]
   *     responses:
   *       200:
   *         description: List of featured jobs
   */
  getFeaturedJobs = catchAsync(async (_req: Request, res: Response) => {
    const jobs = await this.jobService.getFeaturedJobs(6);
    
    res.status(200).json(
      ApiResponse.success(jobs, 'Featured jobs retrieved successfully')
    );
  });
}
