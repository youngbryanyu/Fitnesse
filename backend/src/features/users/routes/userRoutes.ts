/* Routes for user authentication */
import express from 'express';
import UserController from '../controllers/userController';
import { getRateLimitCreateUser, getRateLimitUpdateUser } from '../rateLimit/userRateLimit';
import AuthController from '../../auth/controllers/authController';

const userRouter = express.Router();

/* Create user */
userRouter.post(
  '/',
  getRateLimitCreateUser(),
  AuthController.verify,
  AuthController.checkAccess,
  UserController.createUser
);

/* Update user */
userRouter.put(
  '/:userId',
  getRateLimitUpdateUser(),
  AuthController.verify,
  AuthController.checkAccess,
  UserController.updateUser
);

export default userRouter;
