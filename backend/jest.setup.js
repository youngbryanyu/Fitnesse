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

/* Mock Redis client in all unit tests */
jest.mock('./src/redis/redisClient', () => ({
  getClient: jest.fn().mockImplementation(() => ({
    sendCommand: jest.fn().mockResolvedValue('OK'),
  })),
}));