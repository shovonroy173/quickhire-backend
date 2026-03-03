import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../common/utils/ApiError';
import { ApiResponse } from '../../../common/utils/ApiResponse';
import { catchAsync } from '../../../common/utils/catchAsync';
import { UserService } from '../services/user.service';

export class UserController {
  private userService = new UserService();

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;

    const result = await this.userService.findAll(
      { search: search as string | undefined },
      pageNumber,
      limitNumber
    );

    res.status(200).json(
      ApiResponse.success(result.data, 'Users retrieved successfully', {
        page: pageNumber,
        limit: limitNumber,
        total: result.total,
        pages: Math.ceil(result.total / limitNumber),
      })
    );
  });

  getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userService.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(ApiResponse.success(user, 'User retrieved successfully'));
  });

  createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = String(req.body.email).toLowerCase();
    const exists = await this.userService.existsByEmail(email);

    if (exists) {
      return next(new ApiError(409, 'Email already registered'));
    }

    const user = await this.userService.create({
      ...req.body,
      email,
    });

    res.status(201).json(ApiResponse.success(user, 'User created successfully'));
  });

  updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.email) {
      const email = String(req.body.email).toLowerCase();
      const exists = await this.userService.existsByEmail(email, req.params.id);
      if (exists) {
        return next(new ApiError(409, 'Email already registered'));
      }
      req.body.email = email;
    }

    const user = await this.userService.update(req.params.id, req.body);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(ApiResponse.success(user, 'User updated successfully'));
  });

  deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await this.userService.delete(req.params.id);

    if (!deleted) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
  });
}
