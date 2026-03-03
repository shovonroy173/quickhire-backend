import { Job } from '../models/job.model';
import { IJob } from '../types/job.interface';
import { JobDTO, JobDetailDTO } from '../dtos/job.dto';

export class JobService {
  async findAll(
    filters: any = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: JobDTO[]; total: number }> {
    const query: any = { status: 'active' };

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ featured: -1, postedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return {
      data: JobDTO.fromArray(jobs as IJob[]),
      total,
    };
  }

  async findById(id: string): Promise<JobDetailDTO | null> {
    const job = await Job.findById(id)
      .populate('postedBy', 'name email')
      .lean();

    if (!job) {
      return null;
    }

    return new JobDetailDTO(job as IJob);
  }

  async create(data: Partial<IJob>): Promise<JobDTO> {
    const job = await Job.create(data);
    return new JobDTO(job);
  }

  async update(id: string, data: Partial<IJob>): Promise<JobDTO | null> {
    const job = await Job.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!job) {
      return null;
    }

    return new JobDTO(job as IJob);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Job.findByIdAndDelete(id);
    return !!result;
  }

  async getFeaturedJobs(limit: number = 6): Promise<JobDTO[]> {
    const jobs = await Job.find({ featured: true, status: 'active' })
      .sort({ postedAt: -1 })
      .limit(limit)
      .lean();

    return JobDTO.fromArray(jobs as IJob[]);
  }

  async incrementViews(id: string): Promise<void> {
    await Job.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async incrementApplications(id: string): Promise<void> {
    await Job.findByIdAndUpdate(id, { $inc: { applications: 1 } });
  }
}
