/* Application setup */
import express, { Express } from 'express';
import mongoose from 'mongoose';

/**
 * The backend application server.
 */
class App {
  /* Express middleware */
  private express: Express;

  /**
   * Constructor for the backend application server {@link App}.
   */
  constructor() {
    this.express = express();
    this.initializeMiddleWares();
    this.mountRoutes();
  }

  /**
   * Initialize middlewares for the application.
   */
  private initializeMiddleWares(): void {
    /* Use express middleware to parse HTTP requests in JSON format */
    this.express.use(express.json());
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  private mountRoutes(): void {}

  /**
   * Connect to the MongoDB using the connection URL. Exits with error if connection fails.
   */
  private async connectToDatabase(): Promise<void> {
    /* Get connection URL from environment variables */
    const mongoUrl = process.env.MONGO_URL;

    /* Check if connection URL exists in environment variables */
    if (!mongoUrl) {
      console.error('MongoDB URL environment variable is not defined.');
      process.exit(1);
    }

    /* Try connecting to the database specified by the connection URL */
    try {
      await mongoose.connect(mongoUrl);
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Failed to connect to MongoBD.', error);
      process.exit(1);
    }
  }

  /**
   * Starts the backend server and listens for incoming connections. Exits with error if server fails to start.
   * @param port port number that the backend server listens on. 
   */
  public async startServer(port: number): Promise<void> {
    try {
      /* Await connection to MongoDB */
      await this.connectToDatabase();

      /* Listen for connections */
      this.express.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    } catch (error) {
      console.error('Error starting the server.', error);
      process.exit(1);
    }
  }

  // TODO: make server await to listen to db
}

/**
 * Export App class
 */
export default App;