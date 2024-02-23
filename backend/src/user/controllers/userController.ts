/* Business logic for user related APIs */
import { Request, Response } from 'express';
import { User } from '../models/user';
import { UserResponses } from '../constants';
import { GenericResponses } from '../../constants';

/**
 * Business logic for user related APIs
 */
class UserController {
  /**
   * Creates a new user. Requires an access token from Firebase, since firebase auth is used.
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      /* Check if user already created */
      const user = await User.findById(req.body._id);
      if (user) {
        res.status(409).json({
          message: UserResponses._409_UserAlreadyExists
        });
        return;
      }

      /* Create new user, don't need to worry about dupes since using firebase auth */
      const newUser = new User({
        _id: req.body._id,
        age: req.body.age,
        sex: req.body.sex,
        height: req.body.height,
        weight: req.body.weight,
        activityLevel: req.body.activityLevel,
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
        message: UserResponses._201_UserCreateSuccessful
      });
    } catch (error) {
      res.status(500).json({
        message: GenericResponses._500
      });
    }
  }
}

export default UserController;
