/* Global jest setup file for all tests */

/* Remove all console print statements */
global.console = {
  log: jest.fn(), // Mock console.log
  error: jest.fn(), // Mock console.error
  warn: jest.fn(), // Mock console.warn
  info: jest.fn(), // Mock console.info
  debug: jest.fn(), // Mock console.debug
}

/* Mock all timeouts */
global.setTimeout = jest.fn(cb => cb());