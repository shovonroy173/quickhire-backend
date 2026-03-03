import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/utils/ApiError';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new ApiError(
    404,
    `Cannot ${req.method} ${req.originalUrl}`
  );
  next(error);
};
