/* Unit tests for the auth routes */
import { Request, Response } from "express";
import { UserModel } from '../../src/models/userModel';
import AuthController from '../../src/controllers/authController';
import {
  createRequest, createResponse, MockRequest, MockResponse
} from 'node-mocks-http';
import { API_URLS_V1, AUTH_RESPONSES } from "../../src/config/constants";
import { NextFunction } from "express";

jest.mock('../../src/models/userModel');
// jest.mock('crypto-js');
// jest.mock('express-rate-limit', () => {
//   return jest.fn(() => (req: Request, res: Response, next: NextFunction) => next());
// });

/* Test auth controller */
describe('Auth Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  /* Setup before each test*/
  beforeEach(() => {
    response = createResponse();
    jest.clearAllMocks();
  });

  /* Test register end point */
  describe('POST /register', () => {

    /* Test successfully creating a new user */
    it('should create a new user and return a success response', async () => {
      /* Mock UserModel to return undefined for a Prom9se<User> upon findOne */
      UserModel.findOne = jest.fn().mockResolvedValue(undefined);
      
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
  });
});