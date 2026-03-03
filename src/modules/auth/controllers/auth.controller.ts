import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../../common/utils/catchAsync';
import { ApiResponse } from '../../../common/utils/ApiResponse';
import { ApiError } from '../../../common/utils/ApiError';
import { AuthService } from '../services/auth.service';
import { config } from '../../../config/env';
import { AuthRequest } from '../../../middlewares/auth.middleware';

export class AuthController {
  private authService = new AuthService();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new admin user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   */
  register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      return next(new ApiError(409, 'Email already registered'));
    }

    const user = await this.authService.createUser({
      name,
      email,
      password,
      role: 'admin',
    });

    const token = this.authService.generateToken(user._id.toString());

    res.status(201).json(
      ApiResponse.success(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
        'User registered successfully'
      )
    );
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const isPasswordValid = await this.authService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = this.authService.generateToken(user._id.toString());
    const refreshToken = this.authService.generateRefreshToken(user._id.toString());

    res.status(200).json(
      ApiResponse.success(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
        'Login successful'
      )
    );
  });

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: New access token generated
   */
  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ApiError(400, 'Refresh token is required'));
    }

    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any;
      const token = this.authService.generateToken(decoded.id);

      res.status(200).json(
        ApiResponse.success({ token }, 'New access token generated')
      );
    } catch (error) {
      return next(new ApiError(401, 'Invalid refresh token'));
    }
  });

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user data
   */
  getCurrentUser = catchAsync(async (req: AuthRequest, res: Response) => {
    res.status(200).json(
      ApiResponse.success(req.user, 'Current user retrieved successfully')
    );
  });
}
