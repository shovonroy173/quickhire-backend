import Joi from 'joi';

export const createApplicationSchema = Joi.object({
  jobId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid job ID format',
    'any.required': 'Job ID is required',
  }),
  
  name: Joi.string().required().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  
  email: Joi.string().required().email().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  
  resumeLink: Joi.string().required().uri().messages({
    'string.uri': 'Please provide a valid URL for your resume',
    'any.required': 'Resume link is required',
  }),
  
  coverNote: Joi.string().required().min(10).max(2000).messages({
    'string.min': 'Cover note must be at least 10 characters long',
    'string.max': 'Cover note cannot exceed 2000 characters',
    'any.required': 'Cover note is required',
  }),
  
  portfolio: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid portfolio URL',
  }),
  
  linkedIn: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid LinkedIn URL',
  }),
  
  experience: Joi.string().valid('0-1', '1-3', '3-5', '5-10', '10+').optional(),
});

export const applicationIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid application ID format',
    'any.required': 'Application ID is required',
  }),
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().required().valid('pending', 'reviewed', 'accepted', 'rejected').messages({
    'any.only': 'Please select a valid status',
    'any.required': 'Status is required',
  }),
  
  notes: Joi.string().optional().max(500).messages({
    'string.max': 'Notes cannot exceed 500 characters',
  }),
});
