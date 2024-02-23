/* Routes for user authentication */
import express from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../../logging/logger';
import Config from 'simple-app-config';
import { GENERIC_RESPONSES } from '../../constants';
import UserController from '../controllers/userController';

const router = express.Router();

/* Rate limit create user API */
const rateLimitCreateUser = rateLimit({
  windowMs: Config.get('RATE_LIMITING.AUTH.REGISTER.WINDOW'),
  max: Config.get('RATE_LIMITING.AUTH.REGISTER.THRESHOLD'),
  handler: (req, res) => {
    logger.info(`The register rate limit has been reached for IP ${req.ip}`);
    res.status(429).json({
      message: GENERIC_RESPONSES[429]
    });
  }
});

/* Create user */
router.post('/', rateLimitCreateUser, UserController.createUser);

export default router;
