import Config from 'simple-app-config';
import logger from './logging/logger';
import RedisClient from './database/redis/redisClient';
import MongodbClient from './database/mongodb/mongodbClient';
import App, { IApp } from './app';

/* Whether app has been imported */
let initializedApp = false;

main();

/**
 * Main function that encapsulates all startup logic
 */
async function main() {
  /* Listen for termination events and disconnect from DBs upon termination */
  process.on('SIGINT', async () => {
    await tearDownResources();
  });
  process.on('SIGTERM', async () => {
    await tearDownResources();
  });

  /* Await for all DB connections to establish */
  await createDatabaseConnections();

  /* Start application */
  const port: number = Config.get('PORT');
  const app = await startApp(port);
  initializedApp = true;

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
    try {
      const app: IApp = new App();

      /* Start the express server */
      await app.startServer(port);
      return app;
    } catch (error) {
      logger.error('Failed to start the application:\n', error);
      await tearDownResources();
      process.exit(1);
    }
  }

  /**
   * Resource tear down function to exit gracefully. Closes all database connections and server ports/
   */
  async function tearDownResources() {
    /* Disconnect from mongodb */
    await MongodbClient.reset();

    /* Disconnect from redis */
    await RedisClient.reset();

    /* Close server ports */
    if (initializedApp) {
      app.closePort(port);
    }
  }
}
