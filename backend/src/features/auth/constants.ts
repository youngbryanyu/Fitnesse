/* Constants and nums related to authentication */

/**
 * Authentication related HTTP headers. These should be lower-case since headers are converted to lower case when handled.
 */
export enum AuthHeaders {
  Authorization = 'authorization',
  Uid = 'uid'
}

export enum AuthResponseMessages {
  _401_InvalidToken = 'You are not authenticated with a valid access token',
  _401_NoAccess = "You aren't authorized to access this resource"
}
