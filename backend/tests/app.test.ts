/* Unit tests for the backend application server class */
import App from '../src/app';
import { Environments } from '../src/features/common/constants';
import logger from '../src/logging/logger';
import { EnvParser } from 'simple-app-config';
import http from 'http';
import fs from 'fs';

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
    appInstance.closeServer(PORT);
  });

  describe('startServer', () => {
    it('should start the server and have it listen successfully', async () => {
      jest.spyOn(http.Server.prototype, 'listen').mockImplementation(function (
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

    it('should start the server and have it listen successfully when the environment is production', async () => {
      EnvParser.getString = jest.fn().mockImplementationOnce(() => {
        return Environments.Prod;
      });
      fs.existsSync = jest.fn().mockImplementation(() => {
        return true;
      });
      fs.readFileSync = jest.fn().mockImplementation(() => {
        return '';
      });
      jest.spyOn(http.Server.prototype, 'listen').mockImplementation(function (
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
      jest.spyOn(http.Server.prototype, 'listen').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(logger, 'error');
      jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      /* Call function */
      await appInstance.startServer(PORT);

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
