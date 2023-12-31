/* Application constants */

// --------------------------------------
// ENVIRONMENTS AND ENVIRONMENT VARIABLES
// --------------------------------------

/* Environments */
export const ENVIRONMENTS = {
  DEV: 'dev',
  PROD: 'prod',
  TEST: 'test'
}

/* Environment file paths */
export const ENV_PATHS = {
  DEV: './.env.dev',
  PROD: './.env.prod',
  TEST: './.env.test'
}

// -----------------
// API ENDPOINT URLS
// -----------------

/* API URLs version 1 */
export const API_URLS_V1 = {
  AUTH: '/fitnesse/v1/auth'
}

// ------------------------------
// API ENDPOINT RESPONSE MESSAGES
// ------------------------------

/* Generic messages for API endpoints */
export const GENERIC_RESPONSES = {
  500: "Internal Server Error.",
}

/* Response messages for auth endpoints */
export const AUTH_RESPONSES = {
  _201_REGISTER_SUCCESSFUL: "User successfully registered.",
  _409_USERNAME_TAKEN: "The username is already taken.",
  _409_EMAIL_TAKEN: "The email is already taken.",
  _429_RATE_LIMIT_EXCEEDED: "Too many requests from this API, please try again later.",
}

// -----------------
// API RATE LIMITING
// -----------------

/* Rate limit defaults */
export const RATE_LIMIT_DEFAULTS = {
  REGISTER_THRESHOLD: 10,
  REGISTER_WINDOW: 3600000,
  LOGIN_THRESHOLD: 60,
  LOGIN_WINDOW: 3600000
}

// -----------------------
// MONGO_DB CONFIGURATIONS
// -----------------------

/* Number of times to retry MongoDB connection */
export const DEFAULT_MONGO_CONNECTION_RETRIES = 2;

/* Timeout before retrying MongoDB connection */
export const DEFAULT_MONGO_CONNECTION_RETRY_TIMEOUT = 1000;