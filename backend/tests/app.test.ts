/* Unit tests for the backend application server class */
import App from '../src/app';
import logger from '../src/logging/logger';
import http from 'http';

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

  afterEach(() => {
    appInstance.closePort(PORT);
  });

  describe('startServer', () => {
    it('should start the server and have it listen successfully', async () => {
      jest.spyOn(http.Server.prototype, 'listen').mockImplementationOnce(function (
        this: http.Server,
        // eslint-disable-next-line
        ...args: any[]
      ) {
        const callback = args.find((arg) => typeof arg === 'function');
        if (callback) callback();
        return this;
      });
      await appInstance.startServer(PORT);
      expect(http.Server.prototype.listen).toHaveBeenCalled();
    });

    it('should fail if express has an error when the server is started ', async () => {
      /* Set up mocks and spies */
      jest.spyOn(http.Server.prototype, 'listen').mockImplementationOnce(() => {
        throw new Error();
      });
      jest.spyOn(logger, 'error');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => undefined as never);

      /* Call function */
      expect.assertions(2);
      try {
        await appInstance.startServer(PORT);
      } catch (error) {
        expect(error).toBeDefined();
      }

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('closePort', () => {
    it('should close a port successfully', async () => {
      /* Set up mocks */
      jest.spyOn(http.Server.prototype, 'listen').mockImplementationOnce(function (
        this: http.Server,
        // eslint-disable-next-line
        ...args: any[]
      ) {
        const callback = args.find((arg) => typeof arg === 'function');
        if (callback) callback();
        return this;
      });
      jest.spyOn(http.Server.prototype, 'close');

      /* Call functions */
      await appInstance.startServer(PORT);
      appInstance.closePort(PORT);

      /* Test against expected */
      expect(http.Server.prototype.close).toHaveBeenCalled();
    });

    it('should fail if closing a port fails', async () => {
      /* Set up mocks */
      jest.spyOn(http.Server.prototype, 'listen').mockImplementationOnce(function (
        this: http.Server,
        // eslint-disable-next-line
        ...args: any[]
      ) {
        const callback = args.find((arg) => typeof arg === 'function');
        if (callback) callback();
        return this;
      });
      jest.spyOn(http.Server.prototype, 'close').mockImplementationOnce(() => {
        throw new Error();
      });
      jest.spyOn(logger, 'error');

      /* Call functions */
      await appInstance.startServer(PORT);
      appInstance.closePort(PORT);

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
