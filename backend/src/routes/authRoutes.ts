/* Routes for user authentication */
import express from 'express';
import AuthController from '../controllers/authController';

/* Initialize router middleware to parse incoming requests */
const router = express.Router();

/**
 * Register route.
 */
router.post('/register', AuthController.register);

/* Export router */
export default router;