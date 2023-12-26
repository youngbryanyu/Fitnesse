/* Business logic for authentication */
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import CryptoJS from 'crypto-js';

/**
 * Controller that contains authentication business logic
 */
class AuthController {
  /**
   * Attempts to register a new user.
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
        console.log("The username is already taken");
        res.status(403).json('The username is already taken');
        return;
      }

      /* Check if email is already taken */
      const existingEmailUser = await UserModel.findOne({
        email: req.body.email
      });
      if (existingEmailUser) {
        console.log("The email is already taken");
        res.status(403).json('The email is already taken');
        return;
      }

      /* Get secret key from environment variables for password encryption */
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        console.log("The secret key doesn't exist");
        res.status(500).json("Server error");
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
      console.error("Server error");
      res.status(500).json(error);
    }
  }
}

export default AuthController;