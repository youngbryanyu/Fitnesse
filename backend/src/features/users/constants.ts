/* User related constants */

/**
 * HTTP response messages
 */
export enum UserResponseMessages {
  _400_ImmutableField = 'Cannot modify an immutable field',
  _400_InvalidSchema = "The request body doesn't follow the document schema",
  _400_CastFailed = 'The data type in the body cannot be casted to the required schema datatype',
  _404_UserDoesntExist = "The requested user doesn't exist",
  _409_UserAlreadyExists = 'User already exists.',
  _409_StaleUpdate = "The update failed since it is stale or the user doesn't exist."
}

/**
 * User sexes
 */
export enum Sexes {
  Male = 0,
  Female = 1
}

/**
 * Activity level for user
 */
export enum ActivityLevels {
  Sedentary = 0,
  LightlyActive = 1,
  ModeratelyActive = 2,
  VeryActive = 3,
  ExtremelyActive = 4
}

/**
 * Weight goal
 */
export enum WeightGoals {
  FastLoss = 0,
  ModerateLoss = 1,
  SlowLoss = 2,
  Maintain = 3,
  SlowGain = 4,
  ModerateGain = 5,
  FastGain = 6
}
