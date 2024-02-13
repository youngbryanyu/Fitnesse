/* Application setup */
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/authRoutes';
import { API_URLS_V1 } from './constants';
import logger from './logging/logger';
import Config from 'simple-app-config';
import helmet from 'helmet';
import http from 'http';

/**
 * The backend application server.
 */
class App {
  /**
   * Express middleware
   */
  private readonly expressApp: Express;
  /**
   * Pool of servers where we map port to server
   */
  private serverPool: Map<number, http.Server>;

  /**
   * Constructor for the backend application server {@link App}.
   */
  constructor() {
    this.expressApp = express();
    this.initializeMiddleWares();
    this.mountRoutes();
    this.setNetworkConfigs();
    this.serverPool = new Map<number, http.Server>();
  }

  /**
   * Initialize middlewares for the application.
   */
  private initializeMiddleWares(): void {
    this.expressApp.use(express.json());
    this.expressApp.use(helmet());

    this.expressApp.use((req, res, next) => {
      const xForwardedFor = req.headers['x-forwarded-for'] as string;
      if (xForwardedFor) {
        console.log(`X-Forwarded-For: ${xForwardedFor}`);
        // Splits the IPs in the header and logs them individually
        const ips = xForwardedFor.split(',');
        ips.forEach((ip, index) => {
          console.log(`Proxy ${index + 1}: ${ip.trim()}`);
        });
      } else {
        console.log('No X-Forwarded-For header found.');
      }
      next();
    });
    
  }

  /**
   * Set network communication configurations.
   */
  private setNetworkConfigs() {
    /* Set trust proxy IPs */
    this.expressApp.set(
      'trust proxy',
      true
    ); /* trust proxy 1 layer out --> this should be render.com's proxy */
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  private mountRoutes(): void {
    this.expressApp.use(API_URLS_V1.AUTH, authRoute);
  }

  /**
   * Connect to the MongoDB using the connection URL in the configuration object. Exits with error if connection fails.
   * @returns Returns a promise indicating completion of the async function.
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

        /* Wait for 1 second before retrying */
        logger.info('Retrying connection to MongoDB...');
        await new Promise((resolve) => setTimeout(resolve, retryTimeout));
      }
    }
  }

  /**
   * Starts the backend server and listens for incoming connections. Exits with error if server fails to start.
   * @param port port number that the backend server listens on.
   * @returns Returns a promise indicating completion of the async function.
   */
  public async startServer(port: number): Promise<void> {
    try {
      /* Add server to server pool and listen for connections */
      const server = this.expressApp.listen(port);
      this.serverPool.set(port, server);
      logger.info(`Server is listening on port ${port}`);
    } catch (error) {
      logger.error('Error starting the server.', error);
      process.exit(1);
    }
  }

  /**
   * Closes a server at a port
   * @param port The port that the server is listening on.
   */
  public closeServer(port: number): void {
    if (this.serverPool.has(port)) {
      const server = this.serverPool.get(port);
      if (server) {
        server.close();
      }
    }
  }

  /**
   * Returns the express middleware.
   * @returns The express middleware.
   */
  public getExpressApp(): Express {
    return this.expressApp;
  }
}

export default App;
