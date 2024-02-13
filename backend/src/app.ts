/* Application setup */
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/authRoutes';
import { API_URLS_V1, CERT_DIR, ENVIRONMENTS } from './constants';
import logger from './logging/logger';
import Config, { EnvParser } from 'simple-app-config';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * The backend application server.
 */
class App {
  /**
   * Express middleware
   */
  private readonly expressApp: Express;
  /**
   * Private key for HTTPS
   */
  private privateKey: string = '';
  /**
   * Certificate for HTTPS
   */
  private certificate: string = '';
  /**
   * Certificate authority who issued certificate
   */
  private certAuth: string = '';
  /**
   * Pool of servers where we map port to server
   */
  private serverPool: Map<number, https.Server>;

  /**
   * Constructor for the backend application server {@link App}.
   */
  constructor() {
    this.expressApp = express();
    this.initializeMiddleWares();
    this.mountRoutes();
    this.createProxy();
    this.serverPool = new Map<number, https.Server>();
  }

  /**
   * Initialize middlewares for the application.
   */
  private initializeMiddleWares(): void {
    this.expressApp.use(express.json());
    this.expressApp.use(helmet());
  }

  /**
   * Mounts the routes for the backend API endpoints.
   */
  private mountRoutes(): void {
    this.expressApp.use(API_URLS_V1.AUTH, authRoute);
  }

  private createProxy(): void {
    const port: number = Config.get('PORT');
    this.expressApp.use(
      API_URLS_V1.PREFIX,
      createProxyMiddleware({
        target: `http://localhost:${port}` /* localhost since proxy is deployed in same environment as backend APIs */,
        changeOrigin: true
        // Optional: pathRewrite: {'^/fitnesse/v1': ''}, if you need to remove the base path
      })
    );
  }

  /**
   * Get the signed certificate used for HTTPS.
   */
  private getCertificate(): void {
    const env = EnvParser.getString('NODE_ENV');
    switch (env) {
      case ENVIRONMENTS.TEST:
      case ENVIRONMENTS.DEV:
        /* get self-signed certificate */
        if (fs.existsSync('./server.key') && fs.existsSync('./server.cert')) {
          this.privateKey = fs.readFileSync('./server.key', 'utf-8');
          this.certificate = fs.readFileSync('./server.cert', 'utf-8');
        }
        return;
      case ENVIRONMENTS.PROD:
        /* Get certificates provided by cert auth from docker container */
        if (
          fs.existsSync(`${CERT_DIR}server.key`) &&
          fs.existsSync(`${CERT_DIR}server.cert`) &&
          fs.existsSync(`${CERT_DIR}ca_bundle.crt`)
        ) {
          this.privateKey = fs.readFileSync(`${CERT_DIR}server.key`, 'utf-8');
          this.certificate = fs.readFileSync(`${CERT_DIR}server.cert`, 'utf-8');
          this.certAuth = fs.readFileSync(`${CERT_DIR}ca_bundle.crt`, 'utf-8');
        }
        return;
    }
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
      /* Get credentials for HTTPS */
      this.getCertificate();
      const credentials = { key: this.privateKey, cert: this.certificate };

      /* Add server to server pool and listen for connections */
      const server = https.createServer(credentials, this.expressApp);
      this.serverPool.set(port, server);
      server.listen(port);
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
