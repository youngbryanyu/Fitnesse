/* Business logic for authentication */
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import CryptoJS from 'crypto-js';
import { AUTH_RESPONSES } from '../config/constants';
import { GENERIC_RESPONSES } from '../config/constants';
import AppConfig from '../config/appConfig';

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
        console.log(`The username ${req.body.username} is already taken.`);
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
        console.log(`The email ${req.body.email} is already taken.`);
        res.status(409).json({
          message: AUTH_RESPONSES._409_EMAIL_TAKEN
        });
        return;
      }

      /* Password validation will be handled on the front end */

      /* Get secret key from environment variables for password encryption */
      const appConfig = new AppConfig();
      const secretKey = appConfig.getConfig('AES_SECRET_KEY');

      /* Create a new user */
      const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: CryptoJS.AES.encrypt(req.body.password, secretKey).toString()
      });

      /* Try saving new user to database */
      const savedUser = await newUser.save();
      res.status(201).json({
        message: AUTH_RESPONSES._201_REGISTER_SUCCESSFUL,
        user: savedUser
      });
    } catch (error) {
      console.error("Server error occured: " + error);
      res.status(500).json({
        message: GENERIC_RESPONSES[500]
      });
    }
  }
}

export default AuthController;