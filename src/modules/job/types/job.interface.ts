import { Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  postedBy: Types.ObjectId | string;
  postedAt: Date;
  deadline?: Date;
  featured: boolean;
  verified: boolean;
  views: number;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobDTO {
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
}
