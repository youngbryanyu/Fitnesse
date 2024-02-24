/* Routes for user authentication */
import express from 'express';
import UserController from '../controllers/userController';
import { getRateLimitCreateUser } from '../rateLimit/userRateLimit';

const userRouter = express.Router();

/* Create user */
userRouter.post('/', getRateLimitCreateUser(), UserController.createUser);

export default userRouter;
