/* Application constants */

/* Environments */
export const ENVIRONMENTS = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'testing'
};

/* API URLs version 1 */
const API_URLS_V1_PREFIX = '/fitnesse/v1';
export const API_URLS_V1 = {
  AUTH: `${API_URLS_V1_PREFIX}/auth`,
  HEALTH_CHECK: `${API_URLS_V1_PREFIX}/healthCheck`
};

/* Generic messages for API endpoints */
export const GENERIC_RESPONSES = {
  429: 'Rate limit exceeded. Too many requests.',
  500: 'Internal Server Error.'
};
