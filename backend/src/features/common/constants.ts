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
  User = `${API_URLS_V1_PREFIX}/user`
}

/* Generic messages for API endpoints */
export enum GenericResponses {
  _429 = 'Rate limit exceeded. Too many requests.',
  _500 = 'Internal Server Error.'
}
