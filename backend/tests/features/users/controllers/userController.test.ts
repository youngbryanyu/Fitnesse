import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import UserController from '../../../../src/features/users/controllers/userController';
import { UserResponseMessages } from '../../../../src/features/users/constants';
import { UserModel } from '../../../../src/features/users/models/userModel';
import { GenericResponses, MongooseErrors } from '../../../../src/features/common/constants';

describe('User Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  beforeEach(() => {
    response = createResponse();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should fail when the user already exists', async () => {
      /* Set up mocks */
      UserModel.findById = jest.fn().mockResolvedValueOnce({
        /* Non-undefined response */
      });

      /* Make request */
      request = createRequest();
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(409);
      expect(response._getJSONData().message).toBe(UserResponseMessages._409_UserAlreadyExists);
    });

    it('should fail if a schema validation error is thrown', async () => {
      /* Set up mocks */
      const error = new Error('error');
      error.name = MongooseErrors.ValidationError;
      UserModel.findById = jest.fn().mockImplementationOnce(() => {
        throw error;
      });

      /* Make request */
      request = createRequest();
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe(GenericResponses._400);
    });

    it('should save the new user to the database', async () => {
      /* Set up mocks */
      UserModel.findById = jest.fn().mockResolvedValueOnce(undefined);
      UserModel.prototype.save = jest.fn().mockResolvedValueOnce(true);

      /* Make request */
      request = createRequest({
        body: {
          _id: '6',
          age: 10,
          sex: 15,
          height: 179,
          weight: 200,
          activityLevel: 0,
          useMetric: false,
          goals: {
            calories: 200,
            protein: 5,
            fat: 5,
            carbohydrates: 5
          }
        }
      });
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData().message).toBe(UserResponseMessages._201_UserCreateSuccessful);
    });

    it('should fail if any other error is thrown', async () => {
      /* Set up mocks */
      UserModel.findById = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Make request */
      request = createRequest();
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GenericResponses._500);
    });
  });
});
