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
  _409_StaleUpdate = 'The update is stale since a newer update has already been applied to the user.'
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
  fastLoss = 0,
  moderateLoss = 1,
  slowLoss = 2,
  maintain = 3,
  slowGain = 4,
  moderateGain = 5,
  fastGain = 6
}
