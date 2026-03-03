import { Document, Types } from 'mongoose';

export interface IApplication extends Document {
  jobId: Types.ObjectId | string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  portfolio?: string;
  linkedIn?: string;
  experience?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  reviewedBy?: Types.ObjectId | string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicationDTO {
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
}
