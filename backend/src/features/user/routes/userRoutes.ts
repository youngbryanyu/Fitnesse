/* Routes for user authentication */
import express from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import logger from '../../../logging/logger';
import Config from 'simple-app-config';
import { API_URLS_V1_PREFIX, Environments, GenericResponses } from '../../common/constants';
import UserController from '../controllers/userController';
import RedisStore from 'rate-limit-redis';
import _ from 'lodash';
import RedisClient from '../../../database/redis/redisClient';

export const userRouter = express.Router();

/* Get redis client */
const redisClient = RedisClient.getClient();

/* Get environment */
const environment = Config.get('ENV');

/* Rate limit create user API */
const rateLimitCreateUser = rateLimit({
  windowMs: Config.get('RATE_LIMITING.USER.POST.WINDOW'),
  max: Config.get('RATE_LIMITING.USER.POST.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The create user rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: GenericResponses._429
    });
  },
  store:
    environment == Environments.Test
      ? new MemoryStore()
      : new RedisStore({
          sendCommand: (...args: string[]) => redisClient.sendCommand(args)
        }),
  keyGenerator: (req) => {
    return `${req.method}-${_.trimStart(req.baseUrl, API_URLS_V1_PREFIX)}-${req.ip}`;
  }
});

/* Create user */
userRouter.post('/', rateLimitCreateUser, UserController.createUser);

export default userRouter;
