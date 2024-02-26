/* Unit tests for the authentication middleware and controllers */
import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import AuthController from '../../../src/features/auth/controllers/authController';
import TestController from '../../testController';
import { AuthResponseMessages } from '../../../src/features/auth/constants';
import FirebaseClient from '../../../src/database/firebase/firebaseClient';
import admin from 'firebase-admin';

/* Mock firebase-admin */
jest.mock('firebase-admin', () => {
  const mockFunction = jest.fn().mockResolvedValue(true);
  return {
    initializeApp: jest.fn(() => ({
      app: jest.fn(() => ({ delete: mockFunction }))
    })),
    app: jest.fn(() => ({
      delete: mockFunction
    })),
    credential: {
      cert: jest.fn().mockReturnValue({})
    },
    auth: jest.fn(() => ({
      verifyIdToken: mockFunction
    }))
  };
});

describe('AuthController Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  beforeEach(() => {
    jest.restoreAllMocks();
    response = createResponse();
  });

  describe('verify', () => {
    it('should respond with 401 unauthorized if there is no authorization header', async () => {
      /* Create request */
      request = createRequest({
        headers: {}
      });

      /* Set up mocks */
      jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verify(request, response, TestController.testFunction);

      /* Test against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AuthResponseMessages._401_Unauthorized);
      expect(TestController.testFunction).not.toHaveBeenCalled();
    });

    it("should respond with 401 unauthorized if the authorization header doesn't follow the bearer schema", async () => {
      /* Create request */
      request = createRequest({
        headers: { authorization: 'invalid_header' }
      });

      /* Set up mocks */
      jest.spyOn(TestController, 'testFunction');

      /* Call function */
      await AuthController.verify(request, response, TestController.testFunction);

      /* Test against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AuthResponseMessages._401_Unauthorized);
      expect(TestController.testFunction).not.toHaveBeenCalled();
    });

    it('should call the next function if the access token is valid', async () => {
      /* Create request */
      request = createRequest({
        headers: { authorization: 'Bearer token' }
      });

      /* Set up mocks */
      jest.spyOn(TestController, 'testFunction');

      /* Call function */
      FirebaseClient.initialize();
      await AuthController.verify(request, response, TestController.testFunction);

      /* Test against expected */
      expect(response.statusCode).toBe(200);
      expect(TestController.testFunction).toHaveBeenCalled();
    });

    it('should respond with 401 unauthorized if the access token is invalid', async () => {
      /* Create request */
      request = createRequest({
        headers: { authorization: 'Bearer token' }
      });

      /* Set up mocks */
      jest.spyOn(TestController, 'testFunction');
      const authMock = jest.fn().mockImplementationOnce(() => {
        throw new Error('Failed to delete app');
      });
      admin.auth = jest.fn().mockReturnValueOnce({ verifyIdToken: authMock });

      /* Call function */
      FirebaseClient.initialize();
      await AuthController.verify(request, response, TestController.testFunction);

      /* Test against expected */
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe(AuthResponseMessages._401_Unauthorized);
      expect(TestController.testFunction).not.toHaveBeenCalled();
    });
  });
});
