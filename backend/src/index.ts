/* Backend server startup script and entry point */
import App from './app';
import EnvConfig from './config/envConfig';
import logger from './logging/logger';


/* Explicitely initialize env config globally */
EnvConfig.initialize();

/* Create env config instance */
const envConfig = new EnvConfig();

/* Get the server port from environmental variables */
const PORT = envConfig.getConfigNumber('PORT');

/* Start application */
startApp(PORT);

/**
 * Initializes middlewares, mounts API routes, connects to MongoDB, and starts the backend server.
 * @param port The port number that the backend server listens on.
 */
async function startApp(port: number) {
  const appInstance = new App();
  appInstance.initializeMiddleWares();
  appInstance.mountRoutes();

  try {
    /* Wait for the MongoDB connection to be established */
    await appInstance.connectToDatabase();

    /* Start the server after successful database connection */
    await appInstance.startServer(port);
  } catch (error) {
    logger.error('Failed to start the application:', error);
    process.exit(1);
  }
}