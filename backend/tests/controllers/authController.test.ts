/* Unit tests for the auth routes */
import { NextFunction, Request, Response } from 'express';
import { User } from '../../src/models/user';
import { FailedLoginUser } from '../../src/models/failedLoginUser';
import { RefreshToken } from '../../src/models/refreshToken';
import { LockedOutUser } from '../../src/models/lockedOutUser';
import AuthController from '../../src/controllers/authController';
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { API_URLS_V1, AUTH_RESPONSES, GENERIC_RESPONSES, HEADERS } from '../../src/constants';
import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';
import Config from 'simple-app-config';
import jwt from 'jsonwebtoken';
import { TestController } from '../testController';

/* Mock user used across tests */
const mockUser = {
  _id: new mongoose.Types.ObjectId(0),
  username: 'test',
  email: 'test',
  password: 'test_password',
  _doc: {
    _id: new mongoose.Types.ObjectId(0),
    username: 'test',
    email: 'test',
    password: 'test_password'
  }
};

describe('Auth Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  beforeEach(() => {
    response = createResponse();
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully with valid input', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(undefined);
      jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockUser);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.register(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._201_REGISTER_SUCCESSFUL);
      expect(User.prototype.save).toHaveBeenCalled();
    });

    it('should fail when the username is already taken', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      jest.spyOn(User.prototype, 'save');

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.register(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._409_USERNAME_TAKEN);
      expect(User.prototype.save).not.toHaveBeenCalled();
    });

    it('should fail when the email is already taken', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(mockUser);
      jest.spyOn(User.prototype, 'save');

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.register(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._409_EMAIL_TAKEN);
      expect(User.prototype.save).not.toHaveBeenCalled();
    });

    it('should fail when the password is invalid', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, 'save');

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test'
        }
      });

      /* Call function */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(422);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._422_INVALID_PASSWORD);
      expect(User.prototype.save).not.toHaveBeenCalled();
    });

    it('should fail when there is a server side error', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });
      jest.spyOn(User.prototype, 'save');

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.register(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GENERIC_RESPONSES[500]);
      expect(User.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockResolvedValueOnce(undefined);
      LockedOutUser.findOneAndDelete = jest.fn().mockImplementationOnce(() => {
        return;
      });
      FailedLoginUser.findOneAndDelete = jest.fn().mockImplementationOnce(() => {
        return;
      });
      RefreshToken.prototype.save = jest.fn().mockImplementationOnce(() => {
        return;
      });
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString()
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._200_LOGIN_SUCCESSFUL);
    });

    it("should fail when the username or email doesn't belong to an account", async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
    });

    it('should fail when the user is locked out due to too many failed attempts.', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockResolvedValueOnce({});

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(429);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._429_LOCKED_OUT);
    });

    it("should fail and create an entry in the FailedLoginUser collection if the user hasn't failed any recent login attempts, and the password is invalid", async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockResolvedValueOnce(undefined);
      FailedLoginUser.findOne = jest.fn().mockResolvedValueOnce(undefined);
      jest.spyOn(FailedLoginUser.prototype, 'save').mockResolvedValueOnce({});
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
      expect(FailedLoginUser.prototype.save).toHaveBeenCalled();
    });

    it('should fail and increment an entry in the FailedLoginUser collection if the user has failed recent login attempts, and the password is invalid', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockResolvedValueOnce(undefined);
      const maxFailedLogins: number = Config.get('AUTH.MAX_FAILED_LOGINS');
      const mockFailedLoginEntry = new FailedLoginUser({
        _id: new mongoose.Types.ObjectId(0),
        userId: new mongoose.Types.ObjectId(2),
        numFailed: maxFailedLogins - 3,
        createdAt: Date.now(),
        _doc: {
          _id: new mongoose.Types.ObjectId(0),
          userId: new mongoose.Types.ObjectId(2),
          numFailed: maxFailedLogins - 3,
          createdAt: Date.now()
        }
      });
      FailedLoginUser.findOne = jest.fn().mockResolvedValueOnce(mockFailedLoginEntry);
      FailedLoginUser.findOne = jest.fn().mockResolvedValueOnce({
        ...mockFailedLoginEntry,
        save: jest.fn().mockResolvedValueOnce({
          /* Empty mocked return value */
        })
      });

      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
    });

    it("should fail and add an entry in the LockedOutUser collection if the user's recently failed attempts reached the limit", async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockResolvedValueOnce(undefined);
      const maxFailedLogins: number = Config.get('AUTH.MAX_FAILED_LOGINS');
      const mockFailedLoginEntry = {
        _id: new mongoose.Types.ObjectId(0),
        userId: new mongoose.Types.ObjectId(2),
        numFailed: maxFailedLogins,
        createdAt: Date.now(),
        _doc: {
          _id: new mongoose.Types.ObjectId(0),
          userId: new mongoose.Types.ObjectId(2),
          numFailed: maxFailedLogins,
          createdAt: Date.now()
        }
      };
      FailedLoginUser.findOne = jest.fn().mockResolvedValueOnce(mockFailedLoginEntry);
      jest.spyOn(LockedOutUser.prototype, 'save').mockResolvedValueOnce({});
      FailedLoginUser.findOne = jest.fn().mockResolvedValueOnce({
        ...mockFailedLoginEntry,
        save: jest.fn().mockResolvedValueOnce({}),
        deleteOne: jest.fn().mockResolvedValueOnce({})
      });
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
      expect(LockedOutUser.prototype.save).toHaveBeenCalled();
    });

    it('should fail when there is a server error.', async () => {
      /* Set up mocks and spies */
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      LockedOutUser.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Create mock request */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call function */
      await AuthController.login(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GENERIC_RESPONSES[500]);
    });
  });

  describe('verifyAndRefresh', () => {
    it('should fail if the refresh token is undefined', async () => {
      /* Create mock request*/
      request = createRequest({
        headers: {}
      });

      /* Set up mocks and spies */
      const spy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_SESSION_EXPIRED);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should fail if the refresh token is not in the database (login session expired)', async () => {
      /* Create mock request*/
      request = createRequest({
        headers: {
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        return undefined;
      });
      const spy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_SESSION_EXPIRED);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should fail if the access token is undefined', async () => {
      /* Create mock request*/
      request = createRequest({
        headers: {
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      const refreshToken = {};
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      const spy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_NOT_AUTHENTICATED);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should go to the next function if the access token is valid', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-access-token': 'test_access_token',
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      const refreshToken = new RefreshToken();
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshToken.prototype.save = jest.fn().mockImplementationOnce(() => {
        return;
      });
      jwt.verify = jest.fn().mockImplementationOnce(() => () => ({ verified: 'true' }));
      const testFunctionSpy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(200);
      expect(testFunctionSpy).toHaveBeenCalled();
    });

    it('should fail if there is a server-side error', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-access-token': 'test_access_token',
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error('test error');
      });

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GENERIC_RESPONSES[500]);
    });

    it('should attach a new refresh token to the response header if the refresh token is valid but access token is invalid, then call the next function', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-access-token': 'test_access_token',
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      const refreshToken = new RefreshToken();
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshToken.prototype.save = jest
        .fn()
        .mockImplementationOnce(() => {
          return;
        })
        .mockImplementationOnce(() => {
          return;
        });
      jwt.verify = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('access token invalid');
        })
        .mockImplementationOnce(() => () => ({ verified: 'true' }));
      const newAccessToken = 'test access token';
      jwt.sign = jest.fn().mockImplementationOnce(() => {
        return newAccessToken;
      });
      const testFunctionSpy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(200);
      expect(testFunctionSpy).toHaveBeenCalled();
      expect(response.getHeaders()[HEADERS.NEW_ACCESS_TOKEN]).toBe(newAccessToken);
    });

    it('should fail if the refresh token is invalid', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-access-token': 'test_access_token',
          'x-refresh-token': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      const refreshToken = new RefreshToken();
      RefreshToken.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshToken.prototype.save = jest
        .fn()
        .mockImplementationOnce(() => {
          return;
        })
        .mockImplementationOnce(() => {
          return;
        });
      jwt.verify = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('access token invalid');
        })
        .mockImplementationOnce(() => {
          throw new Error('refresh token invalid');
        });
      const testFunctionSpy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_SESSION_EXPIRED);
      expect(testFunctionSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it("should delete the user's refresh token from the DB", async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-refresh-token': 'test_refresh_token',
          'x-user-id': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      jest.spyOn(RefreshToken, 'findOneAndDelete').mockResolvedValueOnce(undefined);

      /* Call function */
      await AuthController.logout(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._200_LOGOUT_SUCCESSFUL);
      expect(RefreshToken.findOneAndDelete).toHaveBeenCalled();
    });

    it('should work without fail even if the refresh token header is undefined', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-user-id': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      jest.spyOn(RefreshToken, 'findOneAndDelete').mockResolvedValueOnce(undefined);

      /* Call function */
      await AuthController.logout(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._200_LOGOUT_SUCCESSFUL);
      expect(RefreshToken.findOneAndDelete).not.toHaveBeenCalled();
    });

    it('should fail if there is a server error', async () => {
      /* Create mock request */
      request = createRequest({
        headers: {
          'x-refresh-token': 'test_refresh_token',
          'x-user-id': 'test_refresh_token'
        }
      });

      /* Set up mocks and spies */
      jest.spyOn(RefreshToken, 'findOneAndDelete').mockImplementationOnce(() => {
        throw new Error('test');
      });

      /* Call function */
      await AuthController.logout(request, response);

      /* Test values against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GENERIC_RESPONSES[500]);
    });
  });
});
