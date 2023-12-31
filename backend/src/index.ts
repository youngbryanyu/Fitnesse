/* Backend server startup script and entry point */
import App from './app';
import appConfig from './config/appConfig';

/* .env loaded in appConfig.ts */

/* Get the server port from environmental variables */
const PORT = appConfig.PORT;

/* Check if server's port number exists in environmental variables. Exit with error if field doesn't exist. */
if (!PORT) {
  console.error('Server port number environment variable is not defined.');
  process.exit(1);
}

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
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}