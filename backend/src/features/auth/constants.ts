/* Constants and nums related to authentication */

/**
 * Authentication related HTTP headers. These should be lower-case since headers are converted to lower case when handled.
 */
export enum AuthHeaders {
  Authorization = 'authorization',
  TokenUid = 'token-uid'
}

export enum AuthResponseMessages {
  _401_Unauthorized = "You are not authenticated with a valid access token or aren't authorized to access this resource."
}
