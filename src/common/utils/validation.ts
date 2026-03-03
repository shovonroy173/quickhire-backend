import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (data: any) => {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return { errors, value: null };
    }

    return { errors: null, value };
  };
};

// Common validation schemas
export const commonValidations = {
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  
  password: Joi.string().min(8).max(30).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password cannot exceed 30 characters',
    'any.required': 'Password is required',
  }),
  
  url: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid URL',
    'any.required': 'URL is required',
  }),
  
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Please provide a valid ID',
    'any.required': 'ID is required',
  }),
};
