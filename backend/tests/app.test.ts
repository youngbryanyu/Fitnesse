/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';
import { Express } from 'express';
import { API_URLS_V1 } from '../src/constants';
import logger from '../src/logging/logger';
import Config from 'simple-app-config';

/* Dummy port for backend server */
const PORT = 3000;

describe('App Tests', () => {
  let appInstance: App;

  beforeAll(async () => {
    appInstance = new App();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('initializeMiddlewares', () => {
    it('should initialize JSON middleware', () => {
      jest.spyOn(appInstance.express, 'use');
      appInstance.initializeMiddleWares();
      expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('mountRoutes', () => {
    it('should mount API routes', () => {
      jest.spyOn(appInstance.express, 'use');
      appInstance.mountRoutes();
      expect(appInstance.express.use).toHaveBeenCalledWith(API_URLS_V1.AUTH, expect.any(Function));
    });
  });

  describe('connectToDatabase', () => {
    it('should successfully connect to MongoDB', async () => {
      /* Set up mocks and spies */
      jest.spyOn(mongoose, 'connect').mockImplementation(() => {
        return { close: jest.fn() } as unknown as Promise<typeof import('mongoose')>;
      });
      jest.spyOn(Config, 'get').mockImplementation(() => {
        return 'dummy connection string';
      });
      jest.spyOn(Config, 'get').mockImplementation(() => {
        return 2;
      });

      /* Connect to DB */
      await appInstance.connectToDatabase();

      /* Test against expected */
      expect(mongoose.connect).toHaveBeenCalled();
    });

    it('should fail and retry connecting to MongoDB if connection fails due to server error', async () => {
      /* Set up mocks and spies */
      jest.spyOn(mongoose, 'connect').mockImplementation(() => {
        throw new Error('Test');
      });
      jest.spyOn(Config, 'get').mockImplementation(() => {
        return 'dummy connection string';
      });
      jest.spyOn(Config, 'get').mockReturnValueOnce(2).mockReturnValueOnce(10);
      jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      // eslint-disable-next-line
      jest.spyOn(global, 'setTimeout').mockImplementation((fn: Function) => fn());
      jest.spyOn(logger, 'error');
      jest.spyOn(logger, 'info');

      /* Connect to database */
      await appInstance.connectToDatabase();

      /* Test against expected */
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(logger.info).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
    });
  });

  describe('startServer', () => {
    it('should start the server and have it listen successfully', async () => {
      jest.spyOn(appInstance.express, 'listen').mockImplementation(() => {
        return { close: jest.fn() } as unknown as ReturnType<Express['listen']>;
      });
      await appInstance.startServer(PORT);
      expect(appInstance.express.listen).toHaveBeenCalled();
    });

    it('should fail if express has an error when the server is started ', async () => {
      /* Set up spies */
      jest.spyOn(appInstance.express, 'listen').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(logger, 'error');
      jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      /* Call function */
      await appInstance.startServer(PORT);

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
