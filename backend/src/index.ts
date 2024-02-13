/* Backend server startup script and entry point */
console.log('start of app');
import App from './app';
console.log('imported app');
import logger from './logging/logger';
console.log('imported logger');
import Config from 'simple-app-config';
console.log('imported simple-app-config');
console.log('environment is: ' + process.env.NODE_ENV);
logger.info('starting the app');
logger.debug('debug');
console.log('after first log statement');

/* Get the server port from configuration object */
const PORT: number = Config.get('PORT');
console.log('port is ' + PORT);

/* Start application */
startApp(PORT);

/**
 * Initializes middlewares, mounts API routes, connects to MongoDB, and starts the backend server.
 * @param port The port number that the backend server listens on.
 */
async function startApp(port: number) {
  console.log('creating app');
  const appInstance = new App();
  console.log('created app');

  try {
    /* Wait for the MongoDB connection to be established */
    console.log('connecting to  db');
    await appInstance.connectToDatabase();
    console.log('connected to  db');

    /* Start the server after successful database connection */
    console.log('starting server');
    await appInstance.startServer(port);
    console.log('started server');
  } catch (error) {
    logger.error('Failed to start the application:', error);
    console.log('failed extra log here');
    appInstance.closeServer(port);
    process.exit(1);
  }
}
