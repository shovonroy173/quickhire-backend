import Joi from 'joi';

export const createJobSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  
  company: Joi.string().required().min(2).max(50).messages({
    'string.min': 'Company name must be at least 2 characters',
    'string.max': 'Company name cannot exceed 50 characters',
    'any.required': 'Company is required',
  }),
  
  location: Joi.string().required().messages({
    'any.required': 'Location is required',
  }),
  
  category: Joi.string().required().valid(
    'Design', 'Sales', 'Marketing', 'Finance', 
    'Technology', 'Engineering', 'Business', 'Human Resource'
  ).messages({
    'any.only': 'Please select a valid category',
    'any.required': 'Category is required',
  }),
  
  type: Joi.string().required().valid(
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'
  ).messages({
    'any.only': 'Please select a valid job type',
    'any.required': 'Job type is required',
  }),
  
  description: Joi.string().required().min(50).max(5000).messages({
    'string.min': 'Description must be at least 50 characters',
    'string.max': 'Description cannot exceed 5000 characters',
    'any.required': 'Description is required',
  }),
  
  requirements: Joi.array().items(Joi.string()).min(1).messages({
    'array.min': 'At least one requirement is required',
  }),
  
  responsibilities: Joi.array().items(Joi.string()),
  
  benefits: Joi.array().items(Joi.string()),
  
  salary: Joi.string().optional(),
  
  experienceLevel: Joi.string().valid('Entry', 'Mid', 'Senior', 'Lead'),
  
  deadline: Joi.date().greater('now').optional(),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  company: Joi.string().min(2).max(50),
  location: Joi.string(),
  category: Joi.string().valid(
    'Design', 'Sales', 'Marketing', 'Finance',
    'Technology', 'Engineering', 'Business', 'Human Resource'
  ),
  type: Joi.string().valid(
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'
  ),
  description: Joi.string().min(50).max(5000),
  requirements: Joi.array().items(Joi.string()),
  responsibilities: Joi.array().items(Joi.string()),
  benefits: Joi.array().items(Joi.string()),
  salary: Joi.string(),
  experienceLevel: Joi.string().valid('Entry', 'Mid', 'Senior', 'Lead'),
  deadline: Joi.date().greater('now'),
  featured: Joi.boolean(),
  status: Joi.string().valid('active', 'closed', 'draft'),
});

export const jobIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid job ID format',
    'any.required': 'Job ID is required',
  }),
});

export const jobQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  type: Joi.string().allow('', null),
  experienceLevel: Joi.string().allow('', null),
  featured: Joi.boolean(),
  sortBy: Joi.string().valid('postedAt', 'title', 'company', 'salary').default('postedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
