/**
 * Import DB clients and logger before all else
 */
import logger from './logging/logger';
import RedisClient from './database/redis/redisClient';

/**
 * IIFE to ensure database connections are established synchronously before anything else uses the DBs
 */
(async () => {
  /**
   * Create DB connections
   */
  await createDatabaseConnections();

  /* Dynamically import other dependencies */
  const App = (await import('./app')).default;
  const Config = (await import('simple-app-config')).default;

  /* Get the server port from configuration object */
  const PORT: number = Config.get('PORT');

  /* Start application */
  startApp(PORT);

  /**
   * Initializes middlewares, mounts API routes, connects to MongoDB, and starts the backend server.
   * @param port The port number that the backend server listens on.
   */
  async function startApp(port: number) {
    const appInstance = new App();

    try {
      /* Wait for the MongoDB connection to be established */
      await appInstance.connectToMongoDB();

      /* Start the server after successful database connection */
      await appInstance.startServer(port);
    } catch (error) {
      logger.error('Failed to start the application:', error);
      appInstance.closeServer(port);
      process.exit(1);
    }
  }

  /**
   * Creates all connections to external DBs.
   */
  async function createDatabaseConnections(): Promise<void> {
    try {
      /* Connect to MongoDB */

      // TODO: move mongodb connection here and create client

      /* Connect to Redis */
      await RedisClient.initialize();
    } catch (error) {
      logger.error('Failed to establish all DB connections:\n', error);
      process.exit(1);
    }
  }
})();
