/* Routes for user authentication */
import express from 'express';
import UserController from '../controllers/userController';
import { getRateLimitCreateUser } from '../rateLimit/userRateLimit';
import AuthController from '../../auth/controllers/authController';

const userRouter = express.Router();

/* Create user */
userRouter.post('/', getRateLimitCreateUser(), AuthController.verify, UserController.createUser);

export default userRouter;
