/* Application setup */
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/authRoutes';
import { API_URLS_V1 } from './constants';
import logger from './logging/logger';
import Config from 'simple-app-config';
import helmet from 'helmet';
/**
 * The backend application server.
 */
class App {
  /* Express middleware */
  public readonly express: Express;

  /**
   * Constructor for the backend application server {@link App}.
   */
  constructor() {
    this.express = express();
  }

  /**
   * Initialize middlewares for the application.
   */
  public initializeMiddleWares(): void {
    /* Use express middleware to parse HTTP requests in JSON format */
    this.express.use(express.json());
    this.express.use(helmet());
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  public mountRoutes(): void {
    this.express.use(API_URLS_V1.AUTH, authRoute);
  }

  /**
   * Connect to the MongoDB using the connection URL in the environmental variables. Exits with error if connection fails.
   */
  public async connectToDatabase(): Promise<void> {
    /* Get connection URL from environment variables */
    const mongoUrl: string = Config.get('MONGO_DB.CONNECTION_URL');

    /* Try connecting to the database specified by the connection URL, with retries */
    let attempts = 0;
    const maxAttempts: number = Config.get('MONGO_DB.CONNECTION_RETRIES');
    const retryTimeout: number = Config.get('MONGO_DB.CONNECTION_RETRY_TIMEOUT');
    while (attempts < maxAttempts) {
      try {
        await mongoose.connect(mongoUrl);
        logger.info('Successfully connected to MongoDB.');
        return;
      } catch (error) {
        logger.error('Failed to connect to MongoDB: ', error);
        attempts++;
        if (attempts >= maxAttempts) {
          logger.error(`Maximum connection attempts of ${maxAttempts} reached for MongoDB.`);
          process.exit(1);
        }
        // Wait for 1 second before retrying
        logger.info('Retrying connection to MongoDB...');
        await new Promise((resolve) => setTimeout(resolve, retryTimeout));
      }
    }
  }

  /**
   * Starts the backend server and listens for incoming connections. Exits with error if server fails to start.
   * @param port port number that the backend server listens on.
   */
  public async startServer(port: number): Promise<void> {
    try {
      /* Listen for connections */
      this.express.listen(port);
      logger.info(`Server is listening on port ${port}`);
    } catch (error) {
      logger.error('Error starting the server.', error);
      process.exit(1);
    }
  }
}

/**
 * Export App class
 */
export default App;
