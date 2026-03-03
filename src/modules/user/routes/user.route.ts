import express from 'express';
import { authorize, authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { UserController } from '../controllers/user.controller';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userQuerySchema,
} from '../validations/user.validation';

const router = express.Router();
const userController = new UserController();

router.get('/', authenticate, authorize('admin'), validate(userQuerySchema, 'query'), userController.getUsers);
router.get('/:id', authenticate, authorize('admin'), validate(userIdSchema, 'params'), userController.getUserById);
router.post('/', authenticate, authorize('admin'), validate(createUserSchema), userController.createUser);
router.put('/:id', authenticate, authorize('admin'), validate(userIdSchema, 'params'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), validate(userIdSchema, 'params'), userController.deleteUser);

export default router;
