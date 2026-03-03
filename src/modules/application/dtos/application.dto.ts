import { IApplication } from '../types/application.interface';

export class ApplicationDTO {
  id: string;
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  portfolio?: string;
  linkedIn?: string;
  experience?: string;
  status: string;
  createdAt: Date;

  constructor(application: IApplication) {
    this.id = application._id.toString();
    this.jobId = application.jobId.toString();
    this.name = application.name;
    this.email = application.email;
    this.resumeLink = application.resumeLink;
    this.coverNote = application.coverNote;
    this.portfolio = application.portfolio;
    this.linkedIn = application.linkedIn;
    this.experience = application.experience;
    this.status = application.status;
    this.createdAt = application.createdAt;
  }

  static fromArray(applications: IApplication[]): ApplicationDTO[] {
    return applications.map(app => new ApplicationDTO(app));
  }
}

export class ApplicationDetailDTO extends ApplicationDTO {
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  job?: any;

  constructor(application: IApplication) {
    super(application);
    this.notes = application.notes;
    this.reviewedBy = application.reviewedBy?.toString();
    this.reviewedAt = application.reviewedAt;
    this.job = application.jobId;
  }
}
