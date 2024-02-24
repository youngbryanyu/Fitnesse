/* Routes for application health checks */
import express from 'express';
import HealthCheckController from '../controllers/healthCheckController';
import { getRateLimitHealthCheck } from '../rateLimit/healthCheckRateLimit';

const healthCheckRouter = express.Router();

/* Health check route */
healthCheckRouter.get('/', getRateLimitHealthCheck(), HealthCheckController.checkHealth);

export default healthCheckRouter;
