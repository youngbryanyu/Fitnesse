/* Business logic for authentication */
import { NextFunction, Request, Response } from 'express';
import CryptoJS from 'crypto-js';
import { HEADERS, AUTH_RESPONSES, PASSWORD_RULES, GENERIC_RESPONSES } from '../constants';
import logger from '../logging/logger';
import jwt from 'jsonwebtoken';
import Config from 'simple-app-config';
import { User } from '../models/user';
import { FailedLoginUser } from '../models/failedLoginUser';
import { LockedOutUser } from '../models/lockedOutUser';
import { RefreshToken } from '../models/refreshToken';

/**
 * Business logic for authentication
 */
class AuthController {
  /**
   * Attempts to register a new user. Will fail if the username or email provided by the user is already taken.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      /* Check if username is already taken */
      const existingUsernameUser = await User.findOne({
        username: req.body.username
      });
      if (existingUsernameUser) {
        logger.info(`The username [${req.body.username}] is already taken.`);
        res.status(409).json({
          message: AUTH_RESPONSES._409_USERNAME_TAKEN
        });
        return;
      }

      /* Check if email is already taken */
      const existingEmailUser = await User.findOne({
        email: req.body.email
      });
      if (existingEmailUser) {
        logger.info(`The email [${req.body.email}] is already taken.`);
        res.status(409).json({
          message: AUTH_RESPONSES._409_EMAIL_TAKEN
        });
        return;
      }

      /* Check if password meets the strength requirements */
      if (AuthController.isValidPassword(req.body.password) === false) {
        logger.info(`The password is invalid and doesn't satisfy strength requirements.`);
        res.status(422).json({
          message: AUTH_RESPONSES._422_INVALID_PASSWORD
        });
        return;
      }

      /* Get secret key from configuration object for password encryption */
      const passwordSecret: string = Config.get('PASSWORD_SECRET');

      /* Create a new user */
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: CryptoJS.AES.encrypt(req.body.password, passwordSecret).toString()
      });

      /* Save the new user to database */
      const savedUser = await newUser.save();
      logger.info(`Registration successful for user with id=${savedUser._id}`);
      res.status(201).json({
        message: AUTH_RESPONSES._201_REGISTER_SUCCESSFUL
      });
    } catch (error) {
      logger.error('Server error occured during registration: ' + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  /**
   * Returns whether the password is valid, meaning it meets strength requirements.
   * @param password The password under validation.
   * @returns Returns whether or not the input password meets strength requirements.
   */
  static isValidPassword(password: string): boolean {
    if (password.length < PASSWORD_RULES.MIN_LENGTH) {
      return false;
    }
    return true;
  }

  /**
   * Attempts to login with a user, and if successful provides the user with an API access token and refresh token (login session
   * token).
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      /* Try to find a user that matches the username or email */
      const user = await User.findOne({
        $or: [{ email: req.body.emailOrUsername }, { username: req.body.emailOrUsername }]
      });

      /* Check if the email or username matches an existing user */
      if (!user) {
        logger.info(`Username or email [${req.body.emailOrUsername}] isn't recognized.`);
        res.status(401).json({
          message: AUTH_RESPONSES._401_INVALID_CREDENTIALS
        });
        return;
      }

      /* Check if user is locked out from too many failed login attempts */
      const lockedOutUser = await LockedOutUser.findOne({
        userId: user._id
      });
      if (lockedOutUser) {
        logger.info(
          `User with id=${user._id} is currently locked out due to too many failed login attempts.`
        );
        res.status(429).json({
          message: AUTH_RESPONSES._429_LOCKED_OUT
        });
        return;
      }

      /* Get secret key from configuration object */
      const passwordSecret: string = Config.get('PASSWORD_SECRET');

      /* Check if password is invalid, and keep track of their recently failed logins */
      const originalPasswordBytes = CryptoJS.AES.decrypt(user.password, passwordSecret);
      const originalPassword = originalPasswordBytes.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        /* Check if user has recently failed login attempts, and update counter for recently failed logins */
        const failedLoginUser = await FailedLoginUser.findOne({
          userId: user._id
        });
        if (!failedLoginUser) {
          /* Create new entry for user who failed to login recently */
          const newFailedLoginUser = new FailedLoginUser({
            userId: user._id,
            numFailed: 1,
            createdAt: Date.now()
          });
          await newFailedLoginUser.save();
        } else {
          /* Update existing entry for user who failed to login recently */
          failedLoginUser.numFailed++;

          /* Check if the count of recently failed logins exceeds the threshold for the user, and lock them out if so */
          const maxFailedLogins: number = Config.get('AUTH.MAX_FAILED_LOGINS');
          if (failedLoginUser.numFailed >= maxFailedLogins) {
            /* Add user to locked out collection */
            const lockedOutUser = new LockedOutUser({
              userId: user._id,
              createdAt: Date.now()
            });
            await lockedOutUser.save();

            /* Remove user from recently failed login collection */
            await failedLoginUser.deleteOne();
          } else {
            /* Save the incremented entry for recently failed login user */
            await failedLoginUser.save();
          }
        }

        /* Send invalid credentials response to client */
        logger.info(`Login for user [${user._id}] failed due to invalid password.`);
        res.status(401).json({
          message: AUTH_RESPONSES._401_INVALID_CREDENTIALS
        });
        return;
      }

      /* Delete user from locked out collection and recently failed logins collections since login is successful */
      await FailedLoginUser.findOneAndDelete({
        userId: user._id
      });
      await LockedOutUser.findOneAndDelete({
        userId: user._id
      });

      /* Sign access token and refresh tokens */
      const accessTokenSecret: string = Config.get('ACCESS_TOKEN_SECRET');
      const refreshTokenSecret: string = Config.get('REFRESH_TOKEN_SECRET');
      const accessTokenLifetime: string = Config.get('AUTH.ACCESS_TOKEN_LIFETIME');
      const accessToken = jwt.sign({ sub: user._id }, accessTokenSecret, {
        expiresIn: accessTokenLifetime
      });
      const refreshToken = jwt.sign(
        { sub: user._id },
        refreshTokenSecret
        // - refresh tokens won't expire, but will be revoked by application logic if they've timed out and been removed from the
        //   refreshToken collection
        // - refresh tokens are stored in the DB, and removed from the DB upon idle timeout */
      );

      /* Add refresh token (loggin session) to DB */
      const refreshTokenEntry = new RefreshToken({
        userId: user._id,
        lastUsed: Date.now(),
        token: refreshToken
      });
      await refreshTokenEntry.save();

      /* Return user info and JWT tokens to client */
      // eslint-disable-next-line
      const { password, ...info } = user._doc;
      logger.info(`Login successful for user with id=${user._id}`);
      res.status(200).json({
        message: AUTH_RESPONSES._200_LOGIN_SUCCESSFUL,
        ...info,
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    } catch (error) {
      logger.error('Server error occured during login: ' + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  /**
   * Attempts to log out a user by deleting their refresh token from the DB. This endpoint is authenticated by the
   * {@link AuthController.verifyAndRefreshSensitive} middleware function.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      /* Get refresh token from headers */
      const refreshTokenHeader = req.headers[HEADERS.REFRESH_TOKEN] as string;

      /* Delete user's refresh token from DB */
      const refreshToken = refreshTokenHeader.split(' ')[1];
      const refreshTokenSecret: string = Config.get('REFRESH_TOKEN_SECRET');
      const payload = jwt.verify(refreshToken, refreshTokenSecret) as jwt.JwtPayload;
      const userId = payload.sub;
      await RefreshToken.findOneAndDelete({ userId: userId, token: refreshToken });

      /* Respond to client */
      logger.info(`Successfully logged out user with id=${userId}`);
      res.status(200).json({
        message: AUTH_RESPONSES._200_LOGOUT_SUCCESSFUL
      });
    } catch (error) {
      logger.error('Server error occured during logout: ' + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  /**
   * Verifies if an access token is valid for a non-sensitive API endpoint. If not, it attempts to refresh it. If refresh is
   * successful, attaches the new access token to the `X-New-Access-Token` response header. For less sensitive API endpoints since
   * the login session is only checked on refresh, meaning the DB doesn't need to be queried on all checks.
   * @param req The request.
   * @param res The response.
   * @param next The next function to call in the middleware function stack.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async verifyAndRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /* Get tokens and userId from request header */
      const accessTokenHeader = req.headers[HEADERS.ACCESS_TOKEN] as string;
      const refreshTokenHeader = req.headers[HEADERS.REFRESH_TOKEN] as string;

      /* Check if access token is undefined */
      if (!accessTokenHeader) {
        res.status(401).json({
          message: AUTH_RESPONSES._401_NOT_AUTHENTICATED
        });
        return;
      }

      /* Verify access token, throws error if token is invalid */
      const accessTokenSecret: string = Config.get('ACCESS_TOKEN_SECRET');
      const refreshTokenSecret: string = Config.get('REFRESH_TOKEN_SECRET');
      const accessToken = accessTokenHeader.split(' ')[1];

      try {
        /* Check validity of access token */
        jwt.verify(accessToken, accessTokenSecret);

        /* Go to next middleware function */
        next();
      } catch (error) {
        /* Check if refresh token is undefined */
        if (!refreshTokenHeader) {
          res.status(401).json({
            message: AUTH_RESPONSES._401_SESSION_EXPIRED
          });
          return;
        }

        let userId: string | undefined;
        let refreshToken: string;
        try {
          /* Check validity of refresh token and get userId from payload */
          refreshToken = refreshTokenHeader.split(' ')[1];
          const payload = jwt.verify(refreshToken, refreshTokenSecret) as jwt.JwtPayload;
          userId = payload.sub;
        } catch (error) {
          res.status(401).json({
            message: AUTH_RESPONSES._401_SESSION_EXPIRED
          });
          return;
        }

        /* Check if the login session has expired (refresh token) */
        const refreshTokenEntry = await RefreshToken.findOne({
          userId: userId,
          token: refreshToken
        });
        if (!refreshTokenEntry) {
          res.status(401).json({
            message: AUTH_RESPONSES._401_SESSION_EXPIRED
          });
          return;
        }

        /* Update last used time for refresh token (login session) */
        refreshTokenEntry.lastUsed = new Date(Date.now());
        await refreshTokenEntry.save();

        /* Attach a new access token to response header */
        const accessTokenLifetime: string = Config.get('AUTH.ACCESS_TOKEN_LIFETIME');
        const newAccessToken = jwt.sign({ sub: userId }, accessTokenSecret, {
          expiresIn: accessTokenLifetime
        });
        res.setHeader(HEADERS.NEW_ACCESS_TOKEN, newAccessToken);

        /* Go to next middleware function */
        next();
      }
    } catch (error) {
      logger.error('Server error occured during JWT token verification or refresh: ' + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  /**
   * Verifies if an access token is valid for a sensitive API endpoint. If not, it attempts to refresh it. If refresh is successful,
   * attaches the new access token to the `x-new-access-token` response header. For more sensitive API endpoints since the login
   * session is always checked before verifying the access token and all other checks.
   * @param req The request.
   * @param res The response.
   * @param next The next function to call in the middleware function stack.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async verifyAndRefreshSensitive(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      /* Get tokens and userId from request header */
      const accessTokenHeader = req.headers[HEADERS.ACCESS_TOKEN] as string;
      const refreshTokenHeader = req.headers[HEADERS.REFRESH_TOKEN] as string;

      /* Check if refresh token is undefined */
      if (!refreshTokenHeader) {
        res.status(401).json({
          message: AUTH_RESPONSES._401_SESSION_EXPIRED
        });
        return;
      }

      /* Verify refresh token */
      const refreshToken = refreshTokenHeader.split(' ')[1];
      const refreshTokenSecret: string = Config.get('REFRESH_TOKEN_SECRET');
      let userId: string | undefined;
      try {
        const payload = jwt.verify(refreshToken, refreshTokenSecret) as jwt.JwtPayload;
        userId = payload.sub;
      } catch (error) {
        res.status(401).json({
          message: AUTH_RESPONSES._401_SESSION_EXPIRED
        });
        return;
      }

      /* Check if the login session has expired (refresh token) */
      const refreshTokenEntry = await RefreshToken.findOne({
        userId: userId,
        token: refreshToken
      });
      if (!refreshTokenEntry) {
        res.status(401).json({
          message: AUTH_RESPONSES._401_SESSION_EXPIRED
        });
        return;
      }

      /* Check if access token is undefined */
      if (!accessTokenHeader) {
        res.status(401).json({
          message: AUTH_RESPONSES._401_NOT_AUTHENTICATED
        });
        return;
      }

      const accessTokenSecret: string = Config.get('ACCESS_TOKEN_SECRET');
      const accessToken = accessTokenHeader.split(' ')[1];
      try {
        /* Check validity of access token */
        jwt.verify(accessToken, accessTokenSecret);

        /* Go to next middleware function */
        next();
      } catch (error) {
        /* Update last used time for refresh token (login session) */
        refreshTokenEntry.lastUsed = new Date(Date.now());
        await refreshTokenEntry.save();

        /* Attach a new access token to response header */
        const accessTokenLifetime: string = Config.get('AUTH.ACCESS_TOKEN_LIFETIME');
        const newAccessToken = jwt.sign({ sub: userId }, accessTokenSecret, {
          expiresIn: accessTokenLifetime
        });
        res.setHeader(HEADERS.NEW_ACCESS_TOKEN, newAccessToken);

        /* Go to next middleware function */
        next();
      }
    } catch (error) {
      logger.error('Server error occured during JWT token verification or refresh: ' + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  // static async test(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   res.status(200).json({
  //     message: "WORKED"
  //   });
  // }
}

export default AuthController;
