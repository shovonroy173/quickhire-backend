import { Application } from '../models/application.model';
import { IApplication } from '../types/application.interface';
import { ApplicationDTO, ApplicationDetailDTO } from '../dtos/application.dto';
import { JobService } from '../../job/services/job.service';

export class ApplicationService {
  private jobService = new JobService();

  async create(data: Partial<IApplication>): Promise<ApplicationDTO> {
    const application = await Application.create(data);
    
    // Increment applications count on job
    await this.jobService.incrementApplications(application.jobId.toString());
    
    return new ApplicationDTO(application);
  }

  async findById(id: string): Promise<ApplicationDetailDTO | null> {
    const application = await Application.findById(id)
      .populate('jobId')
      .lean();

    if (!application) {
      return null;
    }

    return new ApplicationDetailDTO(application as IApplication);
  }

  async findByJobAndEmail(jobId: string, email: string): Promise<boolean> {
    const application = await Application.findOne({ jobId, email });
    return !!application;
  }

  async findByJob(
    jobId: string,
    filters: any = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: ApplicationDTO[]; total: number }> {
    const query: any = { jobId };
    
    if (filters.status) {
      query.status = filters.status;
    }

    const skip = (page - 1) * limit;
    
    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(query),
    ]);

    return {
      data: ApplicationDTO.fromArray(applications as IApplication[]),
      total,
    };
  }

  async findByEmail(
    email: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: ApplicationDetailDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ email })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('jobId', 'title company location type category')
        .lean(),
      Application.countDocuments({ email }),
    ]);

    return {
      data: applications.map((application) => new ApplicationDetailDTO(application as IApplication)),
      total,
    };
  }

  async updateStatus(
    id: string,
    status: string,
    notes?: string,
    reviewedBy?: string
  ): Promise<ApplicationDTO | null> {
    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!application) {
      return null;
    }

    return new ApplicationDTO(application as IApplication);
  }

  async getApplicationStats(jobId?: string): Promise<any> {
    const match: any = {};
    if (jobId) match.jobId = jobId;

    const stats = await Application.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  }
}
