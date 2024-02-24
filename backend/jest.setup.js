/* Global jest setup file for all tests */

/* Set the NODE_ENV to test */
process.env.NODE_ENV = 'testing';

/* Remove all console print statements - uncomment for debugging, but leave commented when pushing to git */
global.console = {
  log: jest.fn(), 
  error: jest.fn(), 
  warn: jest.fn(), 
  info: jest.fn(),
  debug: jest.fn(), 
}
