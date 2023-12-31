/* Environment app configurations */
import {
  DEFAULT_MONGO_CONNECTION_RETRIES,
  DEFAULT_MONGO_CONNECTION_RETRY_TIMEOUT,
  ENVIRONMENTS,
  ENV_PATHS,
  RATE_LIMIT_DEFAULTS
} from "./constants";
import dotenv from 'dotenv';

/* Parse command line arguments */
parseArgs();

/* Load environmental variables */
loadEnvironmentVariables();

/* Application configurations loaded from .env */
const appConfig = {
  /* Backend port to listen on */
  PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,

  /* MongoDB Connection URL */
  MONGO_URL: process.env.MONGO_URL,

  /* Number of times to retry MongoDB connection upon failure */
  MONGO_CONNECTION_RETRIES: process.env.MONGO_CONNECTION_RETRIES ? parseInt(process.env.MONGO_CONNECTION_RETRIES) : DEFAULT_MONGO_CONNECTION_RETRIES,

  /* Timeout before retrying MongoDB connection */
  MONGO_CONNECTION_RETRY_TIMEOUT: process.env.MONGO_CONNECTION_RETRY_TIMEOUT ? parseInt(process.env.MONGO_CONNECTION_RETRY_TIMEOUT) : DEFAULT_MONGO_CONNECTION_RETRY_TIMEOUT,

  /* Rate limit configurations */
  REGISTER_RATE_LIMIT_THRESHOLD: process.env.REGISTER_RATE_LIMIT_THRESHOLD ? parseInt(process.env.REGISTER_RATE_LIMIT_THRESHOLD) : RATE_LIMIT_DEFAULTS.REGISTER_THRESHOLD,
  REGISTER_RATE_LIMIT_WINDOW: process.env.REGISTER_RATE_LIMIT_WINDOW ? parseInt(process.env.REGISTER_RATE_LIMIT_WINDOW) : RATE_LIMIT_DEFAULTS.REGISTER_WINDOW
}

/* Create default export */
export default appConfig;

/**
 * Parses any command line arguments before starting the application
 */
function parseArgs() {
  /* Check if the --dev flag is set */
  if (process.argv.includes('--dev')) {
    process.env.NODE_ENV = ENVIRONMENTS.DEV;
  }
}

/**
 * Loads the environment variables to configure the application
 */
async function loadEnvironmentVariables() {
  if (process.env.NODE_ENV === ENVIRONMENTS.DEV) {
    dotenv.config({
      path: ENV_PATHS.DEV
    });
  } else if (process.env.NODE_ENV === ENVIRONMENTS.PROD) {
    dotenv.config({
      path: ENV_PATHS.PROD
    });
  } else if (process.env.NODE_ENV === ENVIRONMENTS.TEST) {
    /* Do nothing for unit test environment */
  } else {
    console.error('Environment variable file not found.');
    process.exit(1);
  }
}