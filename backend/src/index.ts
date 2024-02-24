/**
 * Import DB clients and logger before all else
 */
import logger from './logging/logger';
import RedisClient from './database/redis/redisClient';
import MongodbClient from './database/mongodb/mongodbClient';

/**
 * Startup script for the backend server
 */
(async () => {
  /**
   * Create DB connections
   */
  await createDatabaseConnections();

  /* Dynamically import other dependencies */
  const App = (await import('./app')).default;
  const Config = (await import('simple-app-config')).default;

  /* Start application */
  const PORT: number = Config.get('PORT');
  startApp(PORT);

  /**
   * Initializes middlewares, mounts API routes, connects to MongoDB, and starts the backend server.
   * @param port The port number that the backend server listens on.
   */
  async function startApp(port: number) {
    const appInstance = new App();

    try {
      /* Start the express server */
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
      await MongodbClient.initialize();

      /* Connect to Redis */
      await RedisClient.initialize();
    } catch (error) {
      logger.error('Failed to establish all DB connections:\n', error);
      process.exit(1);
    }
  }
})();
