/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';
import express, { Express } from 'express';

<<<<<<< HEAD
/* Partially mock mongoose's connect function */
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn()
  }
});

/* Mock process.exit */
<<<<<<< HEAD
<<<<<<< HEAD
=======
/* Mock process.exit globally to do nothing */
>>>>>>> cb70f89 (finish unit tests for app.ts)
jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
=======
jest.spyOn(process, 'exit').mockImplementation((code?: number) => undefined as never);
>>>>>>> 87dfe08 (make unit tests for app.ts and add retries to mongo)
=======
jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
>>>>>>> 467e792 (fix lint issues)

/* Dummy test MongoDB connection URL */
const TEST_URL = 'TEST_URL'

/* Dummy port */
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
<<<<<<< HEAD
<<<<<<< HEAD
    jest.spyOn(appInstance.express, 'use');
=======
    const spy = jest.spyOn(appInstance.express, 'use');
>>>>>>> 87dfe08 (make unit tests for app.ts and add retries to mongo)
=======
    jest.spyOn(appInstance.express, 'use');
>>>>>>> 467e792 (fix lint issues)
    appInstance.initializeMiddleWares();
    expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
  });

  /* Test mounting of API routes */
  it('should mount API routes', () => {
<<<<<<< HEAD
<<<<<<< HEAD
    jest.spyOn(appInstance.express, 'use');
=======
    const spy = jest.spyOn(appInstance.express, 'use');
>>>>>>> 87dfe08 (make unit tests for app.ts and add retries to mongo)
=======
    jest.spyOn(appInstance.express, 'use');
>>>>>>> 467e792 (fix lint issues)
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

