/* Routes for user authentication */
import express from 'express';
import AuthController from '../controllers/authController';
import rateLimit from 'express-rate-limit';
import { AUTH_RESPONSES } from '../constants';
import logger from '../logging/logger';
import Config from 'simple-app-config';

const router = express.Router();

/* Rate limit register API based on IP */
const rateLimitRegister = rateLimit({
  windowMs: Config.get('RATE_LIMITING.AUTH.REGISTER.WINDOW'),
  max: Config.get('RATE_LIMITING.AUTH.REGISTER.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The register rate limit has been reached for IP ${req.socket.remoteAddress}`);
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});

/* Rate limit login API based on IP */
const rateLimitLogin = rateLimit({
  windowMs: Config.get('RATE_LIMITING.AUTH.LOGIN.WINDOW'),
  max: Config.get('RATE_LIMITING.AUTH.LOGIN.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The login rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});

/* Rate limit logout API based on IP */
const rateLimitLogout = rateLimit({
  windowMs: Config.get('RATE_LIMITING.AUTH.LOGOUT.WINDOW'),
  max: Config.get('RATE_LIMITING.AUTH.LOGOUT.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The logout rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});

/* Register route */
router.post('/register', rateLimitRegister, AuthController.register);

/* Login route */
router.post('/login', rateLimitLogin, AuthController.login);

/* Logout route */
router.delete(
  '/logout',
  rateLimitLogout,
  AuthController.verifyAndRefreshSensitive,
  AuthController.logout
);

// router.post('/test', AuthController.verifyAndRefresh, AuthController.test);

export default router;
