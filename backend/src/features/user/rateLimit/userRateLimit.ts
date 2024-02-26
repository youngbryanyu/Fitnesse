import { NextFunction, Request, Response } from 'express';
import rateLimit, { MemoryStore, RateLimitRequestHandler } from 'express-rate-limit';
import Config from 'simple-app-config';
import logger from '../../../logging/logger';
import { API_URLS_V1_PREFIX, Environments, GenericResponses } from '../../common/constants';
import RedisStore from 'rate-limit-redis';
import RedisClient from '../../../database/redis/redisClient';
import _ from 'lodash';

/* Get environment */
const environment = Config.get('ENV');

/* Lazy load create user rate limiter */
export function getRateLimitCreateUser() {
  let rateLimiterMiddleware: RateLimitRequestHandler | undefined = undefined;

  return function (req: Request, res: Response, next: NextFunction) {
    if (!rateLimiterMiddleware) {
      rateLimiterMiddleware = rateLimit({
        windowMs: Config.get('RATE_LIMITING.USERS.POST.WINDOW'),
        max: Config.get('RATE_LIMITING.USERS.POST.THRESHOLD'),
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
                sendCommand: (...args) => RedisClient.getClient().sendCommand(args)
              }),
        keyGenerator: (req) => {
          return `${req.method}-${_.trimStart(req.baseUrl, API_URLS_V1_PREFIX)}-${req.ip}`;
        }
      });
    }

    rateLimiterMiddleware(req, res, next);
  };
}
