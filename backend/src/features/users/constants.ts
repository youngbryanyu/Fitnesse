/* User related constants */
export enum UserResponseMessages {
  _200_UserUpdateSuccessful = 'Updated user successfully.',
  _201_UserCreateSuccessful = 'Created user successfully.',
  _400_ImmutableField = 'Cannot modify an immutable field',
  _400_InvalidSchema = "The request body doesn't follow the document schema",
  _409_UserAlreadyExists = 'User already exists.'
}
