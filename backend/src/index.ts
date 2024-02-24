import Config from 'simple-app-config';
import logger from './logging/logger';
import RedisClient from './database/redis/redisClient';
import MongodbClient from './database/mongodb/mongodbClient';
import { IApp } from './app';

/* Whether app has been imported */
let importedApp = false;

(async () => {
  /* Listen for termination events and disconnect from DBs upon termination */
  process.on('SIGINT', async () => {
    await tearDownResources();
  });
  process.on('SIGTERM', async () => {
    await tearDownResources();
  });

  /* Create DB connections */
  await createDatabaseConnections();

  /* Dynamically import app since it's dependencies have top-level code that depends on an active redis connection (routes) */
  const App = (await import('./app')).default;
  importedApp = true;

  /* Start application */
  const port: number = Config.get('PORT');
  const app = await startApp(port);

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
      await tearDownResources();
      process.exit(1);
    }
  }

  /**
   * Initializes the app and starts the express server.
   * @param port The port number that the server listens on.
   */
  async function startApp(port: number): Promise<IApp> {
    const app: IApp = new App();

    try {
      /* Start the express server */
      await app.startServer(port);
      return app;
    } catch (error) {
      logger.error('Failed to start the application:', error);
      await tearDownResources();
      process.exit(1);
    }
  }

  /**
   * Resource tear down function to exit gracefully. Closes all database connections and server ports/
   */
  async function tearDownResources() {
    /* Disconnect from redis */
    try {
      await RedisClient.reset();
    } catch (error) {
      logger.info('Failed to disconnect gracefully from Redis:\n', error);
    }

    /* Close server ports */
    try {
      if (importedApp) {
        app.closePort(port);
      }
    } catch (error) {
      logger.info(`Failed to gracefully close all ports from server:\n`, error);
    }
  }
})();
