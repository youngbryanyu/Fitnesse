import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import { AuthResponseMessages } from '../constants';

/**
 * Controller and middleware functions related to authentication
 */
class AuthController {
  /**
   * Verifies whether a JWT access token is valid, using Firebase as the auth service.
   * @param req The incoming HTTP request.
   * @param res The outgoing HTTP response.
   * @param next The next middleware function.
   */
  static async verify(req: Request, res: Response, next: NextFunction) {
    /* Check if headers contains bearer schema */
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).json({
        message: AuthResponseMessages._401_Unauthorized
      });
      return;
    }

    try {
      /* Decode id token */
      const idToken = req.headers.authorization.split(' ')[1];

      /* Verify token with firebase admin sdk */
      await admin.auth().verifyIdToken(idToken);

      /* Call next function */
      next();
    } catch (error) {
      res.status(401).json({
        message: AuthResponseMessages._401_Unauthorized
      });
      return;
    }
  }
}

export default AuthController;
