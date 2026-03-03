import { IJob } from '../types/job.interface';

export class JobDTO {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary?: string;
  experienceLevel?: string;
  postedAt: Date;
  featured: boolean;
  verified: boolean;
  views?: number;
  deadline?: Date;

  constructor(job: IJob) {
    this.id = job._id.toString();
    this.title = job.title;
    this.company = job.company;
    this.location = job.location;
    this.category = job.category;
    this.type = job.type;
    this.description = job.description;
    this.requirements = job.requirements;
    this.responsibilities = job.responsibilities;
    this.benefits = job.benefits;
    this.salary = job.salary;
    this.experienceLevel = job.experienceLevel;
    this.postedAt = job.postedAt;
    this.featured = job.featured;
    this.verified = job.verified;
    this.views = job.views;
    this.deadline = job.deadline;
  }

  static fromArray(jobs: IJob[]): JobDTO[] {
    return jobs.map(job => new JobDTO(job));
  }
}

export class JobDetailDTO extends JobDTO {
  postedBy: string;
  applications: number;
  status: string;

  constructor(job: IJob) {
    super(job);
    this.postedBy = job.postedBy.toString();
    this.applications = job.applications;
    this.status = job.status;
  }
}
