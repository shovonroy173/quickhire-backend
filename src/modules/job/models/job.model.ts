import mongoose from 'mongoose';
import { IJob } from '../types/job.interface';

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [50, 'Company name cannot exceed 50 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resource'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead'],
      default: 'Entry',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posted by user is required'],
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ postedAt: -1 });
jobSchema.index({ featured: -1, postedAt: -1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
