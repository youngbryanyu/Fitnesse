/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';
import { Express } from 'express';

/* Mock process.exit globally to do nothing */
jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

/* Dummy test MongoDB connection URL */
const TEST_URL = 'TEST_URL'

/* Dummy port for backend server */
const PORT = 3000;

/* Dummy MongoDB retry count */
const MONGO_RETRIES = "2";

/* Test backend app server */
describe('App Tests', () => {
  let appInstance: App;

  /* Initialize app instance before all tests */
  beforeAll(async () => {
    appInstance = new App();
  });

  /* Reset all mocks before each test */
  beforeEach(() => {
    jest.clearAllMocks();
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
    appInstance.initializeMiddleWares();
    expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
  });

  /* Test successful connection to MongoDB */
  it('should successfully connect to MongoDB', async () => {
    /* Mock mongoose.connect to return dummy object */
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      return { close: jest.fn() } as unknown as Promise<typeof import("mongoose")>; 
    });
    process.env.MONGO_URL = TEST_URL;
    await appInstance.connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
  });

  /* Test failed connection to MongoDB due to undefined environment variable */
  it('should fail connecting to MongoDB if the environment variable is undefined', async () => {
    await appInstance.connectToDatabase();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  /* Test failed connection to MongoDB due to server error and retries */
  it('should fail and retry connecting to MongoDB if connection fails due to server error', async () => {
    /* Mock mongoose.connect to throw an exception */
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      throw new Error();
    });
    process.env.MONGO_URL = TEST_URL;
    await appInstance.connectToDatabase();
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.log).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalled();
  });

  /* Test when MongoDB connection retries environment variable is undefined and default value is used */
  it('should use the default number of retries if the environment variable is undefined', async () => {
     /* Mock mongoose.connect to return dummy object */
     jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      return { close: jest.fn() } as unknown as Promise<typeof import("mongoose")>; 
    });
    process.env.MONGO_CONNECTION_RETRIES = MONGO_RETRIES;
    await appInstance.connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalled();
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

  /* Clean up environment variables after each test */
  afterEach(() => {
    delete process.env.MONGO_URL;
    delete process.env.MONGO_CONNECTION_RETRIES;
  });
});

