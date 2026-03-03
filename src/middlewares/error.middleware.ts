import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/utils/ApiError';
import { config } from '../config/env';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err as ApiError;

  // Log error
  logger.error(error);

  // If not operational error, create a generic error
  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = 'Internal server error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Send response
  const response = {
    status: 'error',
    message: error.message,
    ...(config.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

// Handle MongoDB duplicate key errors
export const handleDuplicateKeyError = (err: any) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return new ApiError(409, `${field} '${value}' already exists`);
  }
  return err;
};

// Handle JWT errors
export const handleJWTError = () => 
  new ApiError(401, 'Invalid token. Please log in again.');

export const handleJWTExpiredError = () => 
  new ApiError(401, 'Your token has expired. Please log in again.');
