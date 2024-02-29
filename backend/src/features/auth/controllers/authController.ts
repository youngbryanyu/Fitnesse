import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import { AuthHeaders, AuthResponseMessages } from '../constants';

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
        message: AuthResponseMessages._401_InvalidToken
      });
      return;
    }

    try {
      /* Decode id token */
      const idToken = req.headers.authorization.split(' ')[1];

      /* Verify token with firebase admin sdk */
      const tokenPayload = await admin.auth().verifyIdToken(idToken);

      /* Add UID to the header of the request */
      req.headers[AuthHeaders.Uid] = tokenPayload.uid;

      /* Call next function */
      next();
    } catch (error) {
      res.status(401).json({
        message: AuthResponseMessages._401_InvalidToken
      });
      return;
    }
  }

  /**
   * Verifies that a user can access a resouce by checking if the UID in the JWT token (`tokenUid` field in body after `verify` is called) is the same as the user id in the request
   * body or params.
   *
   * - userId is in the path params when performing POST/PUT/DELETE/GET on a document
   * - userId is in the top level of the body when creating a document referencing a user (POST)
   *
   * The body, params, and headers will never be null since we are using the bodyParser middleware.
   * @param req The incoming HTTP request.
   * @param res The outgoing HTTP response.
   * @param next The next middleware function.
   * @returns
   */
  static async checkAccess(req: Request, res: Response, next: NextFunction) {
    /* tokenUid should be added to request body from the `verify` function */
    const tokenUid = req.headers[AuthHeaders.Uid];

    /* Check if decrypted token's UID is undefined */
    if (tokenUid === undefined) {
      res.status(401).json({
        message: AuthResponseMessages._401_NoAccess
      });
      return;
    }

    /* Check if `userId` is in body */
    if (req.body.userId !== undefined && tokenUid !== req.body.userId) {
      res.status(401).json({
        message: AuthResponseMessages._401_NoAccess
      });
      return;
    }

    /* Check if `userId` is in path params */
    if (req.params.userId !== undefined && tokenUid !== req.params.userId) {
      res.status(401).json({
        message: AuthResponseMessages._401_NoAccess
      });
      return;
    }

    /* The request requires involves no userId, continue */
    next();
  }
}

export default AuthController;
