/* Constants and nums related to authentication */

/**
 * Authentication related HTTP headers
 */
export enum AuthHeaders {
  Authorization = 'Authorization'
}

export enum AuthResponseMessages {
  _401_Unauthorized = 'You are not authenticated with a valid access token.'
}
