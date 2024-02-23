/* Global jest setup file for all tests */

/* Set the NODE_ENV to test */
process.env.NODE_ENV = 'testing';

/* Remove all console print statements - uncomment for debugging, but leave commented when pushing to git */
global.console = {
  log: jest.fn(), // Mock console.log
  error: jest.fn(), // Mock console.error
  warn: jest.fn(), // Mock console.warn
  info: jest.fn(), // Mock console.info
  debug: jest.fn(), // Mock console.debug
}

/* Mock Redis client in all unit tests. Needed since redis is used by express-rate-limit in top level code which is imported by App.ts when the routes are loaded */
jest.mock('./src/database/redis/redisClient', () => ({
  getClient: jest.fn().mockImplementation(() => ({
    sendCommand: jest.fn().mockResolvedValue('OK'),
  })),
}));