/* Application setup */
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/authRoutes';
import { ROUTE_URLS_V1 } from './constants/routeUrls';

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
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  public mountRoutes(): void {
    this.express.use(ROUTE_URLS_V1.AUTH_ROUTE, authRoute);
  }

  /**
   * Connect to the MongoDB using the connection URL in the environmental variables. Exits with error if connection fails.
   */
  public async connectToDatabase(): Promise<void> {
    /* Get connection URL from environment variables */
    const mongoUrl = process.env.MONGO_URL;

    /* Check if connection URL exists in environment variables */
    if (!mongoUrl) {
      console.error('MongoDB URL environment variable is not defined.');
      process.exit(1); // TODO: add errors for this, catch, and handle it
    }

    /* Try connecting to the database specified by the connection URL, with retries */
    let attempts = 0;
    const maxAttempts = process.env.MONGO_CONNECTION_RETRIES ? parseInt(process.env.MONGO_CONNECTION_RETRIES) : 2;
    while (attempts < maxAttempts) {
      try {
        await mongoose.connect(mongoUrl);
        console.log('Successfully connected to MongoDB.');
        return;
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        attempts++;
        if (attempts >= maxAttempts) {
          console.error(`Maximum connection attempts of ${maxAttempts} reached for MongoDB.`);
          process.exit(1);
        }
        // Wait for 1 second before retrying 
        console.log('Retrying connection to MongoDB...');
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      this.express.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    } catch (error) {
      console.error('Error starting the server.', error);
      return; // TODO: add errors for this, catch, and handle it
    }
  }
}

/**
 * Export App class
 */
export default App;