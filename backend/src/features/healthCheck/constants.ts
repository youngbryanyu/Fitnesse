/* Health check specific constants */

/* Response messages for auth endpoints */
export enum HealthCheckResponses {
  _200_Success = 'Health check successful',
  _503_Failure = 'Health check failed'
}

export const REDIS_PING_SUCCESS = 'PONG';
