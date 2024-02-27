import { NextFunction, Request, Response } from 'express';
import rateLimit, { MemoryStore, RateLimitRequestHandler } from 'express-rate-limit';
import Config from 'simple-app-config';
import logger from '../../../logging/logger';
import { API_URLS_V1_PREFIX, Environments, GenericResponseMessages } from '../../common/constants';
import RedisStore from 'rate-limit-redis';
import RedisClient from '../../../database/redis/redisClient';
import _ from 'lodash';

/* Get environment */
const environment = Config.get('ENV');

/* Lazy load health check rate limiter */
export function getRateLimitHealthCheck() {
  let rateLimiterMiddleware: RateLimitRequestHandler | undefined = undefined;

  return function (req: Request, res: Response, next: NextFunction) {
    if (!rateLimiterMiddleware) {
      rateLimiterMiddleware = rateLimit({
        windowMs: Config.get('RATE_LIMITING.HEALTH_CHECK.GET.WINDOW'),
        max: Config.get('RATE_LIMITING.HEALTH_CHECK.GET.THRESHOLD'),
        handler: (req, res) => {
          logger.info(`The health check rate limit has been reached for IP ${req.ip}`);
          res.status(429).json({
            message: GenericResponseMessages._429
          });
        },
        store:
          environment == Environments.Test
            ? new MemoryStore()
            : new RedisStore({
                sendCommand: (...args: string[]) => RedisClient.getClient().sendCommand(args)
              }),
        keyGenerator: (req) => {
          return `${req.method}-${_.trimStart(req.baseUrl, API_URLS_V1_PREFIX)}-${req.ip}`;
        }
      });
    }

    rateLimiterMiddleware(req, res, next);
  };
}
