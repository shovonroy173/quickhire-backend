import { Job } from '../models/job.model';
import { IJob } from '../types/job.interface';

export class JobRepository {
  async findWithFilters(filters: any, skip: number, limit: number) {
    return Job.find(filters)
      .sort({ featured: -1, postedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countWithFilters(filters: any): Promise<number> {
    return Job.countDocuments(filters);
  }

  async findById(id: string): Promise<IJob | null> {
    return Job.findById(id).lean();
  }

  async create(jobData: Partial<IJob>): Promise<IJob> {
    const job = new Job(jobData);
    await job.save();
    return job;
  }

  async update(id: string, jobData: Partial<IJob>): Promise<IJob | null> {
    return Job.findByIdAndUpdate(
      id,
      { ...jobData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Job.findByIdAndDelete(id);
    return !!result;
  }

  async findByCategory(category: string, limit: number = 10): Promise<IJob[]> {
    return Job.find({ category, status: 'active' })
      .sort({ postedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findByCompany(company: string, limit: number = 10): Promise<IJob[]> {
    return Job.find({ company, status: 'active' })
      .sort({ postedAt: -1 })
      .limit(limit)
      .lean();
  }
}
