/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';
import { Express } from 'express';
import { API_URLS_V1 } from '../src/constants';
import logger from '../src/logging/logger';
import Config from 'simple-app-config';

/* Dummy port for backend server */
const PORT = 3000;

/* Test backend app server */
describe('App Tests', () => {
  let appInstance: App;

  /* Setup before all tesets */
  beforeAll(async () => {
    /* Initialize app instance */
    appInstance = new App();
  });

  /* Set up before each test */
  beforeEach(() => {
    /* Reset all mock states and implementations */
    jest.restoreAllMocks();
  });

  /* Test initialization of middleware */
  it('should initialize JSON middleware', () => {
    jest.spyOn(appInstance.express, 'use');
    appInstance.initializeMiddleWares();
    expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
  });

  /* Test mounting of API routes */
  it('should mount API routes', () => {
    jest.spyOn(appInstance.express, 'use');
    appInstance.mountRoutes();
    expect(appInstance.express.use).toHaveBeenCalledWith(API_URLS_V1.AUTH, expect.any(Function));
  });

  /* Test successful connection to MongoDB */
  it('should successfully connect to MongoDB', async () => {
    /* Mock mongoose.connect to return dummy object */
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      return { close: jest.fn() } as unknown as Promise<typeof import('mongoose')>;
    });

    /* Mock AppConfig to return a dummy connection string */
    jest.spyOn(Config, 'get').mockImplementation(() => {
      return 'dummy connection string';
    });

    /* Mock AppConfig to return a dummy value for retry values */
    jest.spyOn(Config, 'get').mockImplementation(() => {
      return 2;
    });

    /* Connect to DB */
    await appInstance.connectToDatabase();

    /* Make checks */
    expect(mongoose.connect).toHaveBeenCalled();
  });

  /* Test failed connection to MongoDB due to server error and retries */
  it('should fail and retry connecting to MongoDB if connection fails due to server error', async () => {
    /* Mock mongoose.connect to throw an exception */
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      throw new Error('Test');
    });

    /* Mock AppConfig to return a dummy connection string */
    jest.spyOn(Config, 'get').mockImplementation(() => {
      return 'dummy connection string';
    });

    /* Mock AppConfig to return a dummy value for retry values */
    jest.spyOn(Config, 'get').mockReturnValueOnce(2).mockReturnValueOnce(10);

    /* Mock process.exit globally to do nothing */
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    /* Mock setTimeout to do nothing */
    jest
      .spyOn(global, 'setTimeout')
      .mockImplementation(
        (
          callback: (args: void) => void,
          timeout: number | undefined,
          args: void
        ): NodeJS.Timeout => {
          callback(args);
          return setTimeout(callback, timeout, args) as unknown as NodeJS.Timeout;
        }
      );

    /* Spy on logger and mock them to hide output */
    jest.spyOn(logger, 'error');
    jest.spyOn(logger, 'info');

    /* Connect to database */
    await appInstance.connectToDatabase();

    /* Make checks */
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(logger.info).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalled();
  });

  /* Test that server listens when started  */
  it('should start the server and have it listen successfully', async () => {
    /* Mock express.listen to return dummy object */
    jest.spyOn(appInstance.express, 'listen').mockImplementation(() => {
      return { close: jest.fn() } as unknown as ReturnType<Express['listen']>;
    });
    await appInstance.startServer(PORT);
    expect(appInstance.express.listen).toHaveBeenCalled();
  });

  /* Test when server throws an exception when listening */
  it('should throw an exception if express has an error when the server is started ', async () => {
    /* Mock express.listen to throw an exception */
    jest.spyOn(appInstance.express, 'listen').mockImplementation(() => {
      throw new Error();
    });

    /* Spy on logger.error */
    jest.spyOn(logger, 'error');

    /* Mock process.exit globally to do nothing */
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    await appInstance.startServer(PORT);
    expect(logger.error).toHaveBeenCalled();
  });
});
