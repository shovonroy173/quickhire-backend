import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.validation';

const router = express.Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
