/* Unit tests for the auth routes */
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../src/models/userModel';
import AuthController from '../../src/controllers/authController';
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { API_URLS_V1, AUTH_RESPONSES, GENERIC_RESPONSES, NEW_ACCESS_TOKEN_HEADER } from '../../src/constants';
import { LockedOutUserModel } from '../../src/models/lockedOutUserModel';
import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';
import { FailedLoginUserModel } from '../../src/models/failedLoginUserModel';
import Config from 'simple-app-config';
import { RefreshTokenModel } from '../../src/models/refreshTokenModel';
import jwt from 'jsonwebtoken';
import { TestController } from '../testController';

/* Mock external dependencies */
jest.mock('../../src/models/userModel');

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
    /* Test successfully creating a new user */
    it('should create a new user successfully with valid input', async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock the save method to return an actual user */
      jest.spyOn(UserModel.prototype, 'save').mockResolvedValueOnce(mockUser);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._201_REGISTER_SUCCESSFUL);
      expect(UserModel.prototype.save).toHaveBeenCalled();
    });

    /* Test when username is already taken */
    it('should return a 409 error message when the username is already taken', async () => {
      /* Mock UserModel to return a user upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._409_USERNAME_TAKEN);
    });

    /* Test when email is already taken */
    it('should return a 409 error message when the email is already taken', async () => {
      /* Mock UserModel to return a user upon findOne */
      UserModel.findOne = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockUser);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._409_EMAIL_TAKEN);
    });

    /* Test when password is invalid */
    it('should return a 422 error message when the password is invalid', async () => {
      /* Mock UserModel to return a user upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test'
        }
      });

      /* Call API and get response */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(422);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._422_INVALID_PASSWORD);
    });

    /* Test when there is a server side error */
    it('should return a 500 error message when there is a server side error', async () => {
      /* Mock UserModel to return a user upon findOne */
      UserModel.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/register`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.register(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GENERIC_RESPONSES[500]);
    });
  });

  /* Login API tests */
  describe('login', () => {
    /* Test successfully log in */
    it('should login successfully with valid credentials', async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return undefined opon findOne */
      LockedOutUserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock both LockedOutUserModel and FailedLoginUserModel to do nothing upon findOneAndDelete */
      LockedOutUserModel.findOneAndDelete = jest.fn().mockImplementationOnce(() => {
        return;
      });
      FailedLoginUserModel.findOneAndDelete = jest.fn().mockImplementationOnce(() => {
        return;
      });

      /* Mock RefreshTokenModel to do nothing */
      RefreshTokenModel.prototype.save = jest.fn().mockImplementationOnce(() => {
        return;
      });

      /* Mock the CryptoJS.AES.decrypt method */
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString()
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._200_LOGIN_SUCCESSFUL);
    });

    /* Test when username or email doesn't exist */
    it("should return a 401 error message when the username or email doesn't belong to an account", async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
    });

    /* Test when user is locked out */
    it('should return a 429 error message when the user is locked out due to too many failed attempts.', async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return a non-null value */
      LockedOutUserModel.findOne = jest.fn().mockResolvedValueOnce({});

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(429);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._429_TOO_MANY_FAILED_LOGINS);
    });

    /* Test incorrect login password and user hasn't recently failed and login attempts */
    it("should return a 401 error message and create an entry in FailedLoginUserModel if the user hasn't failed any recent login attempts", async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return undefined opon findOne */
      LockedOutUserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock FailedLoginUserModel to return undefined */
      FailedLoginUserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock the instance of FailedLoginUserModel to do nothing */
      jest.spyOn(FailedLoginUserModel.prototype, 'save').mockResolvedValueOnce({});

      /* Mock the CryptoJS.AES.decrypt method */
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create request mock with incorrect password */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
      expect(FailedLoginUserModel.prototype.save).toHaveBeenCalled();
    });

    /* Test incorrect login password and user has recent failed login attempts */
    it('should return a 401 error message and increment an entry in FailedLoginUserModel if the user has failed any recent login attempts', async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return undefined opon findOne */
      LockedOutUserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock FailedLoginUserModel to return a valid entry */
      const maxFailedLogins: number = Config.get('AUTH.MAX_FAILED_LOGINS');
      const mockFailedLoginEntry = {
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
      };
      FailedLoginUserModel.findOne = jest.fn().mockResolvedValueOnce(mockFailedLoginEntry);

      /* Mock the instance of FailedLoginUserModel to do nothing upon save */
      FailedLoginUserModel.findOne = jest.fn().mockResolvedValueOnce({
        ...mockFailedLoginEntry,
        save: jest.fn().mockResolvedValueOnce({
          /* Mocked return value */
        })
      });

      /* Mock the CryptoJS.AES.decrypt method */
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create request mock with incorrect password */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
    });

    /* Test incorrect login password and user has recent failed login attempts and they reached the failure threshold */
    it("should return a 401 error message and add an entry in LockedOutUserModel if the user's recently failed attempts reached the limit", async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return undefined opon findOne */
      LockedOutUserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      /* Mock FailedLoginUserModel to return a valid entry */
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
      FailedLoginUserModel.findOne = jest.fn().mockResolvedValueOnce(mockFailedLoginEntry);

      /* Mock the instance of LockedOutUserModel to do nothing on save */
      jest.spyOn(LockedOutUserModel.prototype, 'save').mockResolvedValueOnce({});

      /* Mock the instance of FailedLoginUserModel to do nothing upon save and delete */
      FailedLoginUserModel.findOne = jest.fn().mockResolvedValueOnce({
        ...mockFailedLoginEntry,
        save: jest.fn().mockResolvedValueOnce({}),
        deleteOne: jest.fn().mockResolvedValueOnce({})
      });

      /* Mock the CryptoJS.AES.decrypt method */
      const mockDecryptedPassword = {
        toString: () => 'test_password'
      };
      jest
        .spyOn(CryptoJS.AES, 'decrypt')
        .mockReturnValueOnce(mockDecryptedPassword as CryptoJS.lib.WordArray);

      /* Create request mock with incorrect password */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: mockDecryptedPassword.toString() + '_incorrect'
        }
      });

      /* Call API and get response */
      await AuthController.login(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_INVALID_CREDENTIALS);
      expect(LockedOutUserModel.prototype.save).toHaveBeenCalled();
    });

    /* Test when server error is thrown */
    it('should return a 500 error message when there is a server error.', async () => {
      /* Mock UserModel to return undefined for UserModel upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Mock LockedOutUserModel to return a non-null value */
      LockedOutUserModel.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Create request mock */
      request = createRequest({
        method: 'POST',
        url: `${API_URLS_V1.AUTH}/login`,
        body: {
          username: 'test',
          email: 'test',
          password: 'test_password'
        }
      });

      /* Call API and get response */
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
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_REFRESH_FAILED);
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
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
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
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_REFRESH_FAILED);
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
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
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
      const refreshToken = new RefreshTokenModel();
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshTokenModel.prototype.save = jest.fn().mockImplementationOnce(() => {
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
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
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
      const refreshToken = new RefreshTokenModel();
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshTokenModel.prototype.save = jest
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
      const newAccessToken = 'test access token'
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
      expect(response.getHeaders()[NEW_ACCESS_TOKEN_HEADER]).toBe(newAccessToken);
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
      const refreshToken = new RefreshTokenModel();
      RefreshTokenModel.findOne = jest.fn().mockImplementationOnce(() => {
        return refreshToken;
      });
      RefreshTokenModel.prototype.save = jest
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
        })
      const testFunctionSpy = jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verifyAndRefresh(
        request,
        response,
        TestController.testFunction as unknown as NextFunction
      );

      /* Test values against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AUTH_RESPONSES._401_REFRESH_FAILED);
      expect(testFunctionSpy).not.toHaveBeenCalled();
    });
  });
});
