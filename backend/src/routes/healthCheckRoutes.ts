/* Routes for application health checks */
import express from 'express';
import rateLimit from 'express-rate-limit';
import { AUTH_RESPONSES } from '../constants';
import logger from '../logging/logger';
import Config from 'simple-app-config';
import HealthCheckController from '../controllers/healthCheckController';

const router = express.Router();

/* Rate limit register API based on IP */
const rateLimitHealthCheck = rateLimit({
  windowMs: Config.get('RATE_LIMITING.HEALTH_CHECKS.HEALTH_CHECK.WINDOW'),
  max: Config.get('RATE_LIMITING.HEALTH_CHECKS.HEALTH_CHECK.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The register rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});

/* Register route */
router.get('/healthCheck', rateLimitHealthCheck, HealthCheckController.checkHealth);

export default router;
