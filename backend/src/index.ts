/* Backend server startup script and entry point */
import App from './app';
import logger from './logging/logger';
import Config from 'simple-app-config';

logger.info('starting the app');
/* Get the server port from configuration object */
const PORT: number = Config.get('PORT');
logger.info('port is ' + PORT);

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
    await appInstance.connectToDatabase();

    /* Start the server after successful database connection */
    await appInstance.startServer(port);
  } catch (error) {
    logger.error('Failed to start the application:', error);
    appInstance.closeServer(port);
    process.exit(1);
  }
}
