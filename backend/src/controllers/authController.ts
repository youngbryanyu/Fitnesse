/* Business logic for authentication */
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import CryptoJS from 'crypto-js';
import { AUTH_RESPONSES_400 } from '../responses/authResponses';
import { GENERIC_RESPONSES } from '../responses/genericResponses';

/**
 * Controller that contains authentication business logic
 */
class AuthController {
  /**
   * Attempts to register a new user. Will fail if the username or email provided by the user is already taken.
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
        res.status(409).json(AUTH_RESPONSES_400._409_USERNAME_TAKEN);
        return;
      }

      /* Check if email is already taken */
      const existingEmailUser = await UserModel.findOne({
        email: req.body.email
      });
      if (existingEmailUser) {
        console.log(`The email ${req.body.email} is already taken.`);
        res.status(409).json(AUTH_RESPONSES_400._409_EMAIL_TAKEN);
        return;
      }

      /* Get secret key from environment variables for password encryption */
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        console.log("The secret key doesn't exist in the environment varirables.");
        res.status(500).json(GENERIC_RESPONSES[500]);
        return;
      }

      /* Create a new user */
      const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: CryptoJS.AES.encrypt(req.body.password, secretKey).toString()
      });

      /* Try saving new user to database */
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Server error occured: " + error);
      res.status(500).json(GENERIC_RESPONSES[500]);
    }
  }
}

export default AuthController;