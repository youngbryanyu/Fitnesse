/* Unit tests for the auth routes */
import { Request, Response } from "express";
import { UserModel } from '../../src/models/userModel';
import AuthController from '../../src/controllers/authController';
import {
  createRequest, createResponse, MockRequest, MockResponse
} from 'node-mocks-http';
import { API_URLS_V1, AUTH_RESPONSES, GENERIC_RESPONSES } from "../../src/config/constants";

/* Mock the mongoose user model that retrieves from the database */
jest.mock('../../src/models/userModel');

const mockUser = {
  _id: 'test',
  username: 'test',
  email: 'test',
  password: 'test_password'
}

/* Test auth controller */
describe('Auth Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  /* Setup before each test */
  beforeEach(() => {
    response = createResponse();
    jest.clearAllMocks();
  });

  /* Test register end point */
  describe('POST /register', () => {

    /* Test successfully creating a new user */
    it('should create a new user and return a success response', async () => {
      /* Mock UserModel to return undefined for a Promise<User> upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

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
    });

    /* Test when username is already taken */
    it('should return a 409 error message when the username is already taken', async () => {
      /* Mock UserModel to return a user upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);

      /* Spy on console.log and mock to hide output */
      jest.spyOn(console, 'log').mockImplementationOnce(() => { return 0 });

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
      UserModel.findOne = jest.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(mockUser);

      /* Spy on console.log and mock to hide output */
      jest.spyOn(console, 'log').mockImplementationOnce(() => { return 0 });

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
      UserModel.findOne = jest.fn().mockImplementationOnce(() => { throw new Error() });

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
});

/* TODO: implement logging mechanism */