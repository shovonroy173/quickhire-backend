import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../common/utils/ApiError';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate = (
  schema: Joi.ObjectSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ApiError(422, JSON.stringify(errors)));
    }

    (req as any)[target] = value;
    next();
  };
};
