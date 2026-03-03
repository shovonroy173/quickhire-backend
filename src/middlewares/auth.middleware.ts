import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../common/utils/ApiError';
import { config } from '../config/env';
import { User } from '../modules/user/model/user.model';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Please authenticate');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Please authenticate');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(new ApiError(401, 'Please authenticate'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Please authenticate'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }

    next();
  };
};
