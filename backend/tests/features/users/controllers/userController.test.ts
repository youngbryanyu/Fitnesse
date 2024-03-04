import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import UserController from '../../../../src/features/users/controllers/userController';
import { UserResponseMessages } from '../../../../src/features/users/constants';
import { UserModel } from '../../../../src/features/users/models/userModel';
import { GenericResponseMessages, MongooseErrors } from '../../../../src/features/common/constants';

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
      expect(response._getJSONData().message).toBe(UserResponseMessages._400_InvalidSchema);
    });

    it('should fail if a cast error is thrown', async () => {
      /* Set up mocks */
      const error = new Error('error');
      error.name = MongooseErrors.CastError;
      UserModel.findById = jest.fn().mockImplementationOnce(() => {
        throw error;
      });

      /* Make request */
      request = createRequest();
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe(UserResponseMessages._400_CastFailed);
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
    });

    it('should return a 500 code if any other error is thrown', async () => {
      /* Set up mocks */
      UserModel.findById = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Make request */
      request = createRequest();
      await UserController.createUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GenericResponseMessages._500);
    });
  });

  describe('updateUser', () => {
    it('should fail when trying to update the immutable _id field', async () => {
      /* Set up mocks */
      class CustomError extends Error {
        codeName = MongooseErrors.ImmutableFieldError;
        constructor() {
          super();
        }
      }
      UserModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw new CustomError();
      });

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe(UserResponseMessages._400_ImmutableField);
    });

    it('should fail when updating a field to the wrong datatype', async () => {
      /* Set up mocks */
      const error = new Error();
      error.name = MongooseErrors.CastError;
      UserModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw error;
      });

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe(UserResponseMessages._400_CastFailed);
    });

    it('should return a 409 code when the update is stale', async () => {
      /* Set up mocks */
      UserModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce(undefined);

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(UserResponseMessages._200_StaleUpdate);
    });

    it('should fail when updating an invalid range', async () => {
      /* Set up mocks */
      const error = new Error();
      error.name = MongooseErrors.ValidationError;
      UserModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw error;
      });

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData().message).toBe(UserResponseMessages._400_InvalidSchema);
    });

    it('should return a 500 code for all other errors', async () => {
      /* Set up mocks */
      const error = new Error();
      UserModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw error;
      });

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GenericResponseMessages._500);
    });

    it('should successfully update a user', async () => {
      /* Set up mocks */
      UserModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce(true);

      /* Make request */
      request = createRequest();
      await UserController.updateUser(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(204);
    });
  });

  describe('getUser', () => {
    it('should successfully get a user', async () => {
      /* Create request */
      request = createRequest();

      /* Set up mocks */
      UserModel.findById = jest.fn().mockResolvedValueOnce({});

      /* Call function */
      await UserController.getUser(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(200);
    });

    it('should return a 404 code for nonexistent users', async () => {
      /* Create request */
      request = createRequest();

      /* Set up mocks */
      UserModel.findById = jest.fn().mockResolvedValueOnce(undefined);

      /* Call function */
      await UserController.getUser(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(404);
      expect(response._getJSONData().message).toBe(UserResponseMessages._404_UserDoesntExist);
    });

    it('should return a 500 code for errors', async () => {
      /* Create request */
      request = createRequest();

      /* Set up mocks */
      UserModel.findById = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Call function */
      await UserController.getUser(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GenericResponseMessages._500);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      /* Create request */
      request = createRequest();

      /* Set up mocks */
      UserModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce(true);

      /* Call function */
      await UserController.deleteUser(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(204);
    });

    it('should return a 500 code for errors', async () => {
      /* Create request */
      request = createRequest();

      /* Set up mocks */
      UserModel.findByIdAndDelete = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Call function */
      await UserController.deleteUser(request, response);

      /* Compare against expected */
      expect(response.statusCode).toBe(500);
      expect(response._getJSONData().message).toBe(GenericResponseMessages._500);
    });
  });
});
