/* Routes for application health checks */
import express from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import Config from 'simple-app-config';
import HealthCheckController from '../controllers/healthCheckController';
import { API_URLS_V1_PREFIX, Environments, GenericResponses } from '../../common/constants';
import RedisStore from 'rate-limit-redis';
import _ from 'lodash';
import logger from '../../../logging/logger';
import RedisClient from '../../../database/redis/redisClient';

const healthCheckRouter = express.Router();

/* Get redis client */
const redisClient = RedisClient.getClient();

/* Get environment */
const environment = Config.get('ENV');

/* Rate limit register API based on IP */
const rateLimitHealthCheck = rateLimit({
  windowMs: Config.get('RATE_LIMITING.HEALTH_CHECK.GET.WINDOW'),
  max: Config.get('RATE_LIMITING.HEALTH_CHECK.GET.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The health check rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: GenericResponses._429
    });
  },
  store:
    /* istanbul ignore next */
    environment == Environments.Test
      ? new MemoryStore()
      : new RedisStore({
          sendCommand: /* istanbul ignore next */ (...args: string[]) =>
            redisClient.sendCommand(args)
        }),
  keyGenerator: (req) => {
    return `${req.method}-${_.trimStart(req.baseUrl, API_URLS_V1_PREFIX)}-${req.ip}`;
  }
});

/* Health check route */
healthCheckRouter.get('/', rateLimitHealthCheck, HealthCheckController.checkHealth);

export default healthCheckRouter;
