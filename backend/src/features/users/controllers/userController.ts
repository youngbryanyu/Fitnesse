/* Business logic for user related APIs */
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { UserResponseMessages } from '../constants';
import { GenericResponseMessages, MongooseErrors } from '../../common/constants';
import logger from '../../../logging/logger';

/**
 * Business logic for user related APIs
 */
class UserController {
  /**
   * Creates a new user. Requires an access token from Firebase, since firebase auth is used. If the user already exists, it fails.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      /* Check if user already created */
      const user = await UserModel.findById(req.body.userId);
      if (user) {
        res.status(409).json({
          message: UserResponseMessages._409_UserAlreadyExists
        });
        return;
      }

      /* Create new user, don't need to worry about dupes since using firebase auth */
      const newUser = new UserModel({
        _id: req.body.userId, // change to userId
        age: req.body.age,
        sex: req.body.sex,
        height: req.body.height,
        weight: req.body.weight,
        activityLevel: req.body.activityLevel,
        weightGoal: req.body.weightGoal,
        useMetric: req.body.useMetric,
        goals: {
          calories: req.body.goals.calories,
          protein: req.body.goals.protein,
          fat: req.body.goals.fat,
          carbohydrates: req.body.goals.carbohydrates
        }
      });
      await newUser.save();
      res.status(201).json({
        message: UserResponseMessages._201_UserCreateSuccessful,
        newUser: newUser
      });
      /* eslint-disable-next-line */
    } catch (error: any) {
      logger.error('Error occurred during user creation:\n', error);
      if (error.name === MongooseErrors.ValidationError) {
        res.status(400).json({
          message: UserResponseMessages._400_InvalidSchema
        });
      } else {
        res.status(500).json({
          message: GenericResponseMessages._500
        });
      }
    }
  }

  /**
   * Updates an arbitrary number of fields in an existing user. Only updates the user if the request body has a timestamp newer
   * than the existing in the user document.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { updatedAt, ...userData } = req.body;
      const timestamp = new Date(updatedAt);

      /* Try updating user */
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          ...userData,
          updatedAt: timestamp
        },
        {
          new: true,
          runValidators: true,
          upsert: false
        }
      );
      res.status(200).json({
        message: UserResponseMessages._200_UserUpdateSuccessful,
        updatedUser: updatedUser
      });
      /* eslint-disable-next-line */
    } catch (error: any) {
      logger.error('Error occurred during user update:\n', error);
      if (error.codeName === MongooseErrors.ImmutableFieldError) {
        /* Special case with `codeName` field */
        res.status(400).json({
          message: UserResponseMessages._400_ImmutableField
        });
      } else if (error.name === MongooseErrors.CastError) {
        res.status(400).json({
          message: UserResponseMessages._400_InvalidSchema
        });
      } else if (error.name === MongooseErrors.ValidationError) {
        res.status(400).json({
          message: UserResponseMessages._400_InvalidSchema
        });
      } else {
        res.status(500).json({
          message: GenericResponseMessages._500
        });
      }
    }
  }

  /**
   * Returns a user. If the user already exists, it fails.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      /* Check if user already created */
      const user = await UserModel.findById(req.params.userId);
      console.log(JSON.stringify(user));
      if (!user) {
        res.status(404).json({
          message: UserResponseMessages._404_UserDoesntExist
        });
        return;
      }

      res.status(200).json({
        user: user
      });
    } catch (error) {
      logger.error('Error occurred while retrieving user:\n', error);
      res.status(500).json({
        message: GenericResponseMessages._500
      });
    }
  }

  /**
   * Deletes a user and all their data from all collections.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      /* Delete from users collection */
      await UserModel.findByIdAndDelete(req.params.userId);

      res.status(200).json({
        message: UserResponseMessages._200_UserDeleteSuccessful
      });
    } catch (error) {
      logger.error('Error occurred while deleting user:\n', error);
      res.status(500).json({
        message: GenericResponseMessages._500
      });
    }
  }
}

export default UserController;
