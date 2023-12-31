/* Backend server startup script and entry point */
import App from './app';
import AppConfig from './config/appConfig';

/* Explicitely initialize app config globally */
AppConfig.initialize();

/* Create app config instance */
const appConfig = new AppConfig();

/* Get the server port from environmental variables */
const PORT = appConfig.getConfig('PORT');

/* Start application */
startApp(parseInt(PORT));

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
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}