/* Routes for application health checks */
import express from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../../logging/logger';
import Config from 'simple-app-config';
import HealthCheckController from '../controllers/healthCheckController';
import { GENERIC_RESPONSES } from '../../constants';

const router = express.Router();

/* Rate limit register API based on IP */
const rateLimitHealthCheck = rateLimit({
  windowMs: Config.get('RATE_LIMITING.HEALTH_CHECKS.HEALTH_CHECK.WINDOW'),
  max: Config.get('RATE_LIMITING.HEALTH_CHECKS.HEALTH_CHECK.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The register rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: GENERIC_RESPONSES[429]
    });
  }
});

/* Register route */
router.get('/healthCheck', rateLimitHealthCheck, HealthCheckController.checkHealth);

export default router;
