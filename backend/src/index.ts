/* Backend server startup script and entry point */
import App from './app';
import * as dotenv from 'dotenv';

/* Load environmental variables */
dotenv.config();

/* Get the server port from environmental variables */
const PORT = process.env.PORT;

/* Check if server's port number exists in environmental variables. Exit with error if field doesn't exist. */
if (!PORT) {
  console.error('Server port number environment variable is not defined.');
  process.exit(1); // TODO: add errors for this, catch, and handle it
}

/* Start application */
startApp(PORT);

/**
 * Initializes middlewares, mounts API routes, connects to MongoDB, and starts the backend server.
 */
async function startApp(port: string) {
  const appInstance = new App();
  appInstance.initializeMiddleWares();
  appInstance.mountRoutes();

  try {
    /* Wait for the MongoDB connection to be established */
    await appInstance.connectToDatabase();

    /* Start the server after successful database connection */
    await appInstance.startServer(parseInt(port));
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}