/* Routes for user authentication */
import express from 'express';
import AuthController from '../controllers/authController';
import rateLimit from 'express-rate-limit';
import appConfig from '../config/appConfig';
import { AUTH_RESPONSES } from '../config/constants';


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

/* Fixed window rate limit based for registering based on IP */
const registerRateLimit = rateLimit({
  windowMs: appConfig.REGISTER_RATE_LIMIT_WINDOW, 
  max: appConfig.REGISTER_RATE_LIMIT_THRESHOLD,
  handler: (req, res) => {
    res.status(429).json({
      message: AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED
    });
  }
});

/**
 * Register route.
 */
router.post('/register', registerRateLimit, AuthController.register);

/* Export router */
export default router;

/* TODO: implement lockouts after too many failed logins */