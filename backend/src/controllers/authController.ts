/* Business logic for authentication */
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import CryptoJS from 'crypto-js';
import { AUTH_RESPONSES, PASSWORD_RULES } from '../config/constants';
import { GENERIC_RESPONSES } from '../config/constants';
import EnvConfig from '../config/envConfig';
import logger from '../logging/logger';
import { FailedLoginUserModel } from '../models/failedLoginUserModel';
import { LockedOutUserModel } from '../models/lockedOutUserModel';
import jwt from 'jsonwebtoken';

/**
 * Controller that contains authentication business logic
 */
class AuthController {
  /**
   * Attempts to register a new user. Will fail if the username or email provided by the user is already taken. 
   * 
   * Expected body:
   * {
   *    username: ...
   *    email: ...
   *    password: ...
   * }
   * 
   * Response:
   * {
   *    message: ...,
   *    user: ...
   * }
   * @param req incoming request from client.
   * @param res response to return to client.
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      /* Check if username is already taken */
      const existingUsernameUser = await UserModel.findOne({
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
      const existingEmailUser = await UserModel.findOne({
        email: req.body.email
      });
      if (existingEmailUser) {
        logger.info(`The email [${req.body.email}] is already taken.`);
        res.status(409).json({
          message: AUTH_RESPONSES._409_EMAIL_TAKEN
        });
        return;
      }

      /* Password validation. This should be validated on the front end first */
      if (AuthController.isValidPassword(req.body.password) === false) {
        logger.info(`The password is invalid and doesn't satisfy the requirements.`);
        res.status(422).json({
          message: AUTH_RESPONSES._422_INVALID_PASSWORD
        });
        return;
      }

      /* Get secret key from environment variables for password encryption */
      const envConfig = new EnvConfig();
      const secretKey = envConfig.getConfigString('SECRET_KEY');

      /* Create a new user */
      const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: CryptoJS.AES.encrypt(req.body.password, secretKey).toString()
      });

      /* Try saving new user to database */
      const savedUser = await newUser.save();
      logger.info(`Register successful for user [${savedUser._id}]`);
      res.status(201).json({
        message: AUTH_RESPONSES._201_REGISTER_SUCCESSFUL,
        user: savedUser
      });
    } catch (error) {
      logger.error("Server error occured: " + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }

  /**
   * Returns whether the password is valid. The password is valid if its minimum length is at least 8.
   * @param password 
   */
  static isValidPassword(password: string) {
    if (password.length < PASSWORD_RULES.MIN_LENGTH) {
      return false;
    }

    return true;
  }

  /**
   * Attempts to login. 
   * 
   * Expected body:
   * {
   *    emailOrUsername: ...
   *    password: ...
   * }
   * 
   * Response:
   * {
   *    message: ...,
   *    info: ...
   * }
   * @param req incoming request from client.
   * @param res response to return to client.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      /* Try to find a user that matches the email or username */
      const user = await UserModel.findOne({
        $or: [
          { email: req.body.emailOrUsername },
          { username: req.body.emailOrUsername }
        ]
      });

      /* Invalid credentials - email or username doesn't exist */
      if (!user) {
        logger.info(`Username or email [${req.body.emailOrUsername}] isn't recognized.`);
        res.status(401).json({
          message: AUTH_RESPONSES._401_INVALID_CREDENTIALS
        });
        return;
      }
      
      /* Check if user is locked out already */
      const lockedOutUser = await LockedOutUserModel.findOne({
        userId: user._id
      });
      if (lockedOutUser) {
        logger.info(`User [${user._id}] is currently locked out due to too many failed login attempts.`);
        res.status(429).json({
          message: AUTH_RESPONSES._429_TOO_MANY_FAILED_LOGINS
        });
        return;
      }
      
      /* Create app config instance */
      const appConfig = new EnvConfig();
      
      /* Get AES secret key from environment variables */
      const secretKey = appConfig.getConfigString('SECRET_KEY');
      
      /* Check if password matches the decrypted version of the encrypted password stored in the database */
      const originalPasswordBytes = CryptoJS.AES.decrypt(user.password, secretKey);
      const originalPassword = originalPasswordBytes.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        /* Check if user already has recently failed login */
        const failedLoginUser = await FailedLoginUserModel.findOne({
          userId: user._id
        });
        if (!failedLoginUser) {
          /* Create new entry for user who failed to login recently */
          const newFailedLoginUser = new FailedLoginUserModel({
            userId: user._id,
            numFailed: 1,
            createdAt: Date.now()
          });
          await newFailedLoginUser.save();
          logger.info(`Added user [${user._id}] to recently failed login collection.`);
        } else {
          /* Update existing entry for user who failed to login recently */
          failedLoginUser.numFailed++;
          
          /* Check if the number of times recently failed exceeds the threshold for the user */
          const maxFailedLogins = appConfig.getConfigNumber('AUTH.MAX_FAILED_LOGINS')
          if (failedLoginUser.numFailed >= maxFailedLogins) {
            /* Add user to locked out collection */
            const lockedOutUser = new LockedOutUserModel({
              userId: user._id,
              createdAt: Date.now()
            });
            await lockedOutUser.save();
            logger.info(`Added user [${user._id}] to locked out users collection.`);

            /* Remove user from recently failed login collection */
            await failedLoginUser.deleteOne();
            logger.info(`Removed user [${user._id}] from recently failed login collection.`);
          } else {
            /* Save the incremented entry for recently failed login user */
            await failedLoginUser.save();
            logger.info(`Incremented count of user [${user._id}] in recently failed login collection.`);
          }
        }

        /* Send invalid credentials response to client */
        logger.info(`Login for user [${user._id}] failed due to invalid password.`);
        res.status(401).json({
          message: AUTH_RESPONSES._401_INVALID_CREDENTIALS
        });
        return;
      }

      /* Delete user from locked out table and recently failed logins table upon successful login */
      await FailedLoginUserModel.findOneAndDelete({
        userId: user._id
      });
      await LockedOutUserModel.findOneAndDelete({
        userId: user._id
      });
      logger.info(`Removed user [${user._id}] from recently failed login collection and locked out collection.`);

      /* Sign access token and refresh tokens */
      const accessTokenLifetime = appConfig.getConfigString('AUTH.ACCESS_TOKEN_LIFETIME');
      const accessToken = jwt.sign(
        { id: user._id },
        secretKey,
        { expiresIn: accessTokenLifetime }
      );
      const refreshTokenLifetime = appConfig.getConfigString('AUTH.REFRESH_TOKEN_LIFETIME');
      const refreshToken = jwt.sign(
        { id: user._id },
        secretKey,
        { expiresIn: refreshTokenLifetime }
      );

      /* Return user info and access + refresh tokens to client */
      // eslint-disable-next-line
      const { password, ...info } = user._doc;
      logger.info(`Login successful for user [${user._id}].`);
      res.status(200).json({
        message: AUTH_RESPONSES._200_LOGIN_SUCCESSFUL,
        info: {
          ...info,
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      });
    } catch (error) {
      logger.error("Server error occured: " + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }
}

export default AuthController;
