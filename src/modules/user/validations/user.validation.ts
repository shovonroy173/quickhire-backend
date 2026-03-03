import Joi from 'joi';

export const userIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid user ID format',
    'any.required': 'User ID is required',
  }),
});

export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('', null),
});

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'any.required': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).max(64).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 64 characters',
  }),
  role: Joi.string().valid('admin', 'user').default('user'),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(64),
  role: Joi.string().valid('admin', 'user'),
}).min(1);
