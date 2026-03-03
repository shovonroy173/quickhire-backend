import mongoose from 'mongoose';
import { IApplication } from '../types/application.interface';

const applicationSchema = new mongoose.Schema<IApplication>(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    resumeLink: {
      type: String,
      required: [true, 'Resume link is required'],
      trim: true,
    },
    coverNote: {
      type: String,
      required: [true, 'Cover note is required'],
      minlength: [10, 'Cover note must be at least 10 characters long'],
      maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
    },
    portfolio: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      enum: ['0-1', '1-3', '3-5', '5-10', '10+'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ jobId: 1, email: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
