/* Application setup */
import express, { Express } from 'express';
import healthCheckRouter from './features/healthCheck/routes/healthCheckRoutes';
import userRouter from './features/users/routes/userRoutes';
import { ApiUrlsV1 } from './features/common/constants';
import logger from './logging/logger';
import helmet from 'helmet';
import http from 'http';

/**
 * Interface for the App class.
 */
export interface IApp {
  startServer(port: number): Promise<void>;
  getExpressApp(): Express;
  closePort(port: number): void;
}

/**
 * The backend application server.
 */
class App {
  /**
   * Express middleware
   */
  private expressApp: Express;
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

    /* Display proxies that the request went through --> to test how many proxy layers */
    // this.expressApp.use((req, res, next) => {
    //   const xForwardedFor = req.headers['x-forwarded-for'] as string;
    //   if (xForwardedFor) {
    //     console.log(`X-Forwarded-For: ${xForwardedFor}`);
    //   } else {
    //     console.log('No X-Forwarded-For header found.');
    //   }
    //   next();
    // });
  }

  /**
   * Set network communication configurations.
   */
  private setNetworkConfigs() {
    /* Set trust proxy IPs */
    this.expressApp.set(
      'trust proxy',
      3
    ); /* trust proxy 3 layers out --> render.com appears to use 3 layers of proxies */
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  private mountRoutes(): void {
    this.expressApp.use(ApiUrlsV1.HealthCheck, healthCheckRouter);
    this.expressApp.use(ApiUrlsV1.Users, userRouter);
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
      throw error;
    }
  }

  /**
   * Stops listening at a port
   * @param port The port that the server is listening on.
   */
  public closePort(port: number): void {
    if (this.serverPool.has(port)) {
      const server = this.serverPool.get(port);
      if (server) {
        try {
          server.close();
        } catch (error) {
          logger.error(`Failed to gracefully close port from server:\n`, error);
        }
      }
      this.serverPool.delete(port);
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
