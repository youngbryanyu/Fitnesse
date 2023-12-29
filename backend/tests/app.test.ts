/* Unit tests for the backend application server class */
import mongoose from 'mongoose';
import App from '../src/app';

/* Partially mock mongoose's connect function */
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn()
  }
});

/* Mock process.exit */
jest.spyOn(process, 'exit').mockImplementation((code?: number) => undefined as never);

/* Test backend app server */
describe('App Tests', () => {
  let appInstance: App;

  /* Initialize app instance before all tests */
  beforeAll(async () => {
    appInstance = new App();
  });

  /* Clear all mocks before each test */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* Test initialization of middleware */
  it('should initialize JSON middleware', () => {
    const spy = jest.spyOn(appInstance.express, 'use');
    appInstance.initializeMiddleWares();
    expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
  });

  /* Test mounting of API routes */
  it('should mount API routes', () => {
    const spy = jest.spyOn(appInstance.express, 'use');
    appInstance.initializeMiddleWares();
    expect(appInstance.express.use).toHaveBeenCalledWith(expect.any(Function));
  });

  /* Test successful connection to MongoDB */
  it('should successfully connect to MongoDB', async () => {
    process.env.MONGO_URL = undefined;
    await appInstance.connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
  });

  /* Test failed connection to MongoDB */
  it('should fail connecting to MongoDB if the environment variable is undefined', async () => {
    delete process.env.MONGO_URL;
    await appInstance.connectToDatabase();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  /* */

  /* Clean up environment variables after each test */
  afterEach(() => {
    delete process.env.MONGO_URL;
  });
});
