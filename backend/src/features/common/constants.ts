/* Application constants */

/* Environments */
export enum Environments {
  Dev = 'development',
  Prod = 'production',
  Test = 'testing'
}

/* API URLs version 1 */
export const API_URLS_V1_PREFIX = '/fitnesse/v1';
export enum ApiUrlsV1 {
  HealthCheck = `${API_URLS_V1_PREFIX}/healthCheck`,
  Users = `${API_URLS_V1_PREFIX}/users`
}

/* Generic messages for API endpoints */
export enum GenericResponseMessages {
  _400 = 'The request is malformed',
  _429 = 'Rate limit exceeded. Too many requests.',
  _500 = 'Internal Server Error.' /* We want to retry 500 errors from the client */
}

export enum MongooseErrors {
  ValidationError = 'ValidationError' /* `name` of error when schema validation fails */,
  ImmutableFieldError = 'ImmutableField' /* `codeName` when field being updated is immutable */,
  CastError = 'CastError' /* `name` of error when using the wrong data type in a field */
}
