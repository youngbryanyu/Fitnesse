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

/* Create instance of backend app server and listen for connections*/
const appInstance = new App();
appInstance.startServer(parseInt(PORT));
