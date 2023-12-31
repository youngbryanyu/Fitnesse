/* Routes for user authentication */
import express from 'express';
import AuthController from '../controllers/authController';
import rateLimit from 'express-rate-limit';
import { AUTH_RESPONSES } from '../config/constants';
import AppConfig from '../config/appConfig';

/* Initialize router middleware to parse incoming requests */
const router = express.Router();

/* Fixed window rate limit based on user id */
// const loginRateLimiter = rateLimit({
//   windowMs: AUTH_RATE_LIMITS.LOGIN_RATE_LIMIT_WINDOW, 
//   max: AUTH_RATE_LIMITS.LOGIN_RATE_LIMIT_THRESHOLD,
//   keyGenerator: (req) => {
//     return req.body.userId ? req.body.userId : 'unknown-user';
//   },
//   handler: (req, res) => {
//     res.status(429).json({
//       message: AUTH_RESPONSES_400._429_USER_ID_RATE_LIMIT_EXCEEDED
//     });
//   }
// });

const appConfig = new AppConfig('RATE_LIMITING.AUTH');

const rateLimitRegister = rateLimit({
  windowMs: appConfig.getConfigNumber('REGISTER.WINDOW'), 
  max: appConfig.getConfigNumber('REGISTER.THRESHOLD'), 
  handler: (req, res) => {
    console.log(`The register rate limit has been reached for IP ${req.socket.remoteAddress}`);
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});



/**
 * Register route.
 */
router.post('/register', rateLimitRegister, AuthController.register);

/* Export router */
export default router;

/* TODO: implement lockouts after too many failed logins */