/* Application constants */

// --------------------------------------
// ENVIRONMENTS AND ENVIRONMENT VARIABLES
// --------------------------------------

/* Environments */
export const ENVIRONMENTS = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'testing'
};

// -----------------
// API ENDPOINT URLS
// -----------------

/* API URLs version 1 */
export const API_URLS_V1 = {
  PREFIX: '/fitness/v1', /* prefix for the API endpoints */
  AUTH: '/fitnesse/v1/auth'
};

// ------------------------------
// API ENDPOINT RESPONSE MESSAGES
// ------------------------------

/* Generic messages for API endpoints */
export const GENERIC_RESPONSES = {
  500: 'Internal Server Error.'
};

/* Response messages for auth endpoints */
export const AUTH_RESPONSES = {
  _200_LOGIN_SUCCESSFUL: 'Logged in successfully.',
  _200_LOGOUT_SUCCESSFUL: 'Logged out successfully.',
  _201_REGISTER_SUCCESSFUL: 'Registered successfully.',
  _401_INVALID_CREDENTIALS: 'Invalid login credentials.',
  _401_NOT_AUTHENTICATED:
    'You are not authenticated with a valid JWT access token.' /* When the JWT access token is invalid */,
  _401_SESSION_EXPIRED:
    'Session expired. Refresh token is invalid. Please log in again.' /* When the JWT refresh token is invalid (login session expired) */,
  _409_EMAIL_TAKEN: 'The email is already taken.',
  _409_USERNAME_TAKEN: 'The username is already taken.',
  _422_INVALID_PASSWORD:
    "The password is invalid and doesn't meet the requirements." /* During account creation */,
  _429_RATE_LIMIT_EXCEEDED: 'Too many requests from this API, please try again later.',
  _429_LOCKED_OUT:
    'User is locked out due to too many failed login attempts, please try again later.'
};

// ----------------------------
// CUSTOM HTTP RESPONSE HEADERS
// ----------------------------

/* Header for new access tokens upon refresh --> SHOULD BE LOWER CASE SINCE HTTP CONVERTS TO LOWER CASE */
export const HEADERS = {
  NEW_ACCESS_TOKEN: 'x-new-access-token',
  ACCESS_TOKEN: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
  USER_ID: 'x-user-id'
};

// ---------------------------
// PASSWORD AND AUTHENTICATION
// ---------------------------

/* Password creation rules */
export const PASSWORD_RULES = {
  MIN_LENGTH: 8
};

// -------
// NETWORK
// -------

/* Directory where certificates from CA are located*/
export const CERT_DIR = '/etc/ssl/certs/';
