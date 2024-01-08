/* Environment app configurations */
import logger from '../logging/logger';
import { ENVIRONMENTS, ENV_PATHS } from './constants';
import dotenv from 'dotenv';

/**
 * App config class that loads fields from the environment variables.
 * 
 * Usage:
 * - Create environment variables in the form XXX.YYY.ZZZ... in the .env files.
 * - Can set prefix such as XXX in the AppConfig and get config for YYY.ZZZ and it will match XXX.YYY.ZZZ
 */
class AppConfig {
  /**
   * Prefix to begin searching from in the .env file loaded.
   */
  private prefix: string;
  /**
   * Whether the .env file has already been loaded
   */
  private static initialized: boolean = false; 

  /**
   * Constructor for {@link AppConfig}.
   * @param prefix Prefix to start search from in .env. Defaults to '' if not specified.
   */
  constructor(prefix: string = '') {
    this.prefix = prefix;

    /* Attempt to load .env if not done yet */
    AppConfig.initialize();
  }

  /**
   * Retrieves the value of an environment variable from .env based on the key. Starts the search from a prefix if 
   * the {@link prefix} field has been set.
   * @param key The name of the environment variable in .env we are searching for.
   * @returns The value of the specified field as a string.
   */
  public getConfig(key: string): string {
    const fullKey = this.prefix.length !== 0 ? `${this.prefix}.${key}` : key;
    return process.env[fullKey] as string;
  }
  
  /**
   * Identical function to @{@link AppConfig.getConfig}, but with a clearer function name.
   * @param key The name of the environment variable in .env we are searching for.
   * @returns The value of the specified field as a string.
   */
  public getConfigString(key: string): string {
    return this.getConfig(key);
  }

  /**
   * Retrieves the value of an environment variable from .env based on the key. Starts the search from a prefix if 
   * the {@link prefix} field has been set. Converts the output to a number.
   * @param key The name of the variable in .env we are searching for.
   * @returns The value of the specified field as a number.
   */
  public getConfigNumber(key: string): number {
    return parseFloat(this.getConfig(key));
  }

  /**
   * Sets the prefix to start the search from in .env.
   * @param prefix The prefix to begin searching from in .env.
   */
  public setPrefix(prefix: string): void {
    this.prefix = prefix;
  }
  
  /**
   * Initializes the app config by reading command line args and loading the environment variables from .env. Will only
   * perform initialization if it has not been performed globally yet.
   */
  public static initialize(): void {
    if (AppConfig.initialized === false) {
      this.parseArgs();
      this.loadEnvironmentVariables();
      AppConfig.initialized = true;
      logger.info('Initialized AppConfig successfully.');
    } 
  }

  /**
   * Parses any command line arguments before starting the application
   */
  private static parseArgs() {
    /* Check if the --dev flag is set */
    if (process.argv.includes('--dev')) {
      process.env.NODE_ENV = ENVIRONMENTS.DEV;
    } 
    logger.info('Command line args parsed successfully.');
  }

  /**
   * Loads the environment variables to configure the application. 
   * Determines the .env file to user based on the NODE_ENV environment variable.
   */
  private static loadEnvironmentVariables() {
    if (process.env.NODE_ENV === ENVIRONMENTS.DEV) {
      dotenv.config({
        path: ENV_PATHS.DEV
      });
    } else if (process.env.NODE_ENV === ENVIRONMENTS.PROD) {
      dotenv.config({
        path: ENV_PATHS.PROD
      });
    } else if (process.env.NODE_ENV === ENVIRONMENTS.TEST) {
      dotenv.config({
        path: ENV_PATHS.TEST
      });
    } else {
      logger.error('Environment variable file (.env) not found. You should set the necessary environment variables in a .env file, through your deployment environment, or manually in the command line.');
    }

    logger.info(`Environment variables parsed successfully. The environment found was: [${process.env.NODE_ENV}]`);
  }
}

/* Create default export */
export default AppConfig;

/* TODO: Turn this into a library (env-app-config) after other use cases and methods are figured out later */