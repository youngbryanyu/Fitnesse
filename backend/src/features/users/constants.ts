/* User related constants */

/**
 * HTTP response messages
 */
export enum UserResponseMessages {
  _200_UserUpdateSuccessful = 'Updated user successfully.',
  _201_UserCreateSuccessful = 'Created user successfully.',
  _400_ImmutableField = 'Cannot modify an immutable field',
  _400_InvalidSchema = "The request body doesn't follow the document schema",
  _404_UserDoesntExist = "The requested user doesn't exist",
  _409_UserAlreadyExists = 'User already exists.'
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
