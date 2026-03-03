import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { catchAsync } from '../../../common/utils/catchAsync';
import { ApiResponse } from '../../../common/utils/ApiResponse';
import { ApiError } from '../../../common/utils/ApiError';
import { AuthRequest } from '../../../middlewares/auth.middleware';

export class ApplicationController {
  private applicationService = new ApplicationService();

  /**
   * @swagger
   * /applications:
   *   post:
   *     summary: Submit a job application
   *     tags: [Applications]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Application'
   *     responses:
   *       201:
   *         description: Application submitted successfully
   *       400:
   *         description: Already applied to this job
   */
  createApplication = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      resumeLink: String(req.body.resumeLink).trim(),
      coverNote: String(req.body.coverNote).trim(),
    };

    // Check if already applied
    const existing = await this.applicationService.findByJobAndEmail(
      payload.jobId,
      payload.email
    );

    if (existing) {
      return next(new ApiError(400, 'You have already applied for this job'));
    }

    const application = await this.applicationService.create(payload);

    res.status(201).json(
      ApiResponse.success(application, 'Application submitted successfully')
    );
  });

  getMyApplications = catchAsync(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const email = String(req.user?.email ?? '').toLowerCase().trim();

    const result = await this.applicationService.findByEmail(
      email,
      Number(page),
      Number(limit)
    );

    res.status(200).json(
      ApiResponse.success(result.data, 'Applications retrieved successfully', {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit)),
      })
    );
  });

  /**
   * @swagger
   * /applications/job/{jobId}:
   *   get:
   *     summary: Get all applications for a job (Admin only)
   *     tags: [Applications]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: jobId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: List of applications
   */
  getJobApplications = catchAsync(async (req: AuthRequest, res: Response) => {
    const { jobId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const filters: any = { jobId };
    if (status) filters.status = status;

    const result = await this.applicationService.findByJob(
      jobId,
      filters,
      Number(page),
      Number(limit)
    );

    res.status(200).json(
      ApiResponse.success(result.data, 'Applications retrieved successfully', {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit)),
      })
    );
  });

  /**
   * @swagger
   * /applications/{id}:
   *   get:
   *     summary: Get application by ID (Admin only)
   *     tags: [Applications]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Application details
   *       404:
   *         description: Application not found
   */
  getApplicationById = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const application = await this.applicationService.findById(req.params.id);
    
    if (!application) {
      return next(new ApiError(404, 'Application not found'));
    }

    res.status(200).json(
      ApiResponse.success(application, 'Application retrieved successfully')
    );
  });

  /**
   * @swagger
   * /applications/{id}/status:
   *   patch:
   *     summary: Update application status (Admin only)
   *     tags: [Applications]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [pending, reviewed, accepted, rejected]
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  updateStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const application = await this.applicationService.updateStatus(
      req.params.id,
      req.body.status,
      req.body.notes,
      req.user._id
    );
    
    if (!application) {
      return next(new ApiError(404, 'Application not found'));
    }

    res.status(200).json(
      ApiResponse.success(application, 'Application status updated successfully')
    );
  });
}
