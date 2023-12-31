/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';
import { Express } from 'express';
import AppConfig from '../src/config/appConfig';
import { API_URLS_V1 } from '../src/config/constants';

/* 
Note: 
- All environment variables are read into appConfig.ts upon startup so setting process.env variables does not affect them here. This
  makes mocking the environment variables and testing them much harder and less straight forward.
*/

/* Dummy port for backend server */
const PORT = 3000;

/* Test backend app server */
describe('App Tests', () => {
  let appInstance: App;

  /* Initialize app instance before all tests */
  beforeAll(async () => {
    appInstance = new App();
  });

  /* Reset all mocks before each test */
  beforeEach(() => {
    jest.resetAllMocks();
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
      return { close: jest.fn() } as unknown as Promise<typeof import("mongoose")>; 
    });

    /* Mock AppConfig to return a dummy connection string */
    jest.spyOn(AppConfig.prototype, 'getConfigString').mockImplementation(() => {
      return "dummy connection string";
    });
    
    /* Mock AppConfig to return a dummy value for retry values */
    jest.spyOn(AppConfig.prototype, 'getConfigNumber').mockImplementation(() => {
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
      throw new Error("Test");
    });

    /* Mock AppConfig to return a dummy connection string */
    jest.spyOn(AppConfig.prototype, 'getConfigString').mockImplementation(() => {
      return "dummy connection string";
    });
    
    /* Mock AppConfig to return a dummy value for retry values */
    jest.spyOn(AppConfig.prototype, 'getConfigNumber').mockReturnValueOnce(2).mockReturnValueOnce(10);

    /* Mock process.exit globally to do nothing */
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    /* Mock setTimeout to do nothing */
    jest.spyOn(global, 'setTimeout').mockImplementation((fn: Function) => fn());

    /* Connect to database */
    await appInstance.connectToDatabase();

    /* Make checks */
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.log).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
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
    
    await appInstance.startServer(PORT);
    expect(console.error).toHaveBeenCalled();

  });
});
