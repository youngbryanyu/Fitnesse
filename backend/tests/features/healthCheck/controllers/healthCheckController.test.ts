import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import HealthCheckController from '../../../../src/features/healthCheck/controllers/healthCheckController';
import {
  HealthCheckResponses,
  REDIS_PING_SUCCESS
} from '../../../../src/features/healthCheck/constants';
import mongoose from 'mongoose';
import RedisClient from '../../../../src/database/redis/redisClient';
import admin from 'firebase-admin';

/* Mock firebase client */
jest.mock('firebase-admin', () => {
  // Directly mocking the methods under the auth namespace
  const authMock = {
    createCustomToken: jest.fn().mockResolvedValue('dummy_token')
  };

  // Mocking the default export's structure
  return {
    // Simulating the default export with necessary methods
    default: {
      initializeApp: jest.fn(),
      auth: jest.fn(() => authMock),
      credential: {
        cert: jest.fn().mockReturnValue({})
      }
    },
    // You might need these if you're using named exports anywhere
    initializeApp: jest.fn(),
    auth: jest.fn(() => authMock),
    credential: {
      cert: jest.fn().mockReturnValue({})
    }
  };
});
describe('Health Check Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;

  beforeEach(() => {
    response = createResponse();
    jest.clearAllMocks();
  });

  describe('checkHealth', () => {
    it('should succeed when all databases are healthy', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValue({ ok: 1 })
              })
            }
          }
        ])
      });
      RedisClient.getClient = jest.fn().mockReturnValueOnce({
        ping: jest.fn().mockResolvedValueOnce(REDIS_PING_SUCCESS) // Default to success
      });
      admin.auth().createCustomToken = jest.fn().mockResolvedValueOnce('specific_token');

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._200_Success);
    });

    it('should fail when a mongodb ping throws an error', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockRejectedValueOnce(new Error())
              })
            }
          }
        ])
      });

      /* Call function */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected*/
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });

    it('should fail when a redis ping throws an error', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValue({ ok: 1 })
              })
            }
          }
        ])
      });
      RedisClient.getClient = jest.fn().mockReturnValueOnce({
        ping: jest.fn().mockRejectedValueOnce(new Error()) // Default to success
      });

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });

    it('should fail when a firebase ping throws an error', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValue({ ok: 1 })
              })
            }
          }
        ])
      });
      RedisClient.getClient = jest.fn().mockReturnValueOnce({
        ping: jest.fn().mockResolvedValueOnce(REDIS_PING_SUCCESS) // Default to success
      });
      admin.auth().createCustomToken = jest.fn().mockRejectedValueOnce(new Error());

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });

    it('should fail when a mongodb ping has the wrong ping value', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValueOnce({ ok: 2 })
              })
            }
          }
        ])
      });

      /* Call function */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected*/
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });

    it('should fail when a redis ping has the wrong ping value', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValue({ ok: 1 })
              })
            }
          }
        ])
      });
      RedisClient.getClient = jest.fn().mockReturnValueOnce({
        ping: jest.fn().mockResolvedValueOnce('NOT_PONG') // Default to success
      });

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });

    it('should fail when a firebase ping has the wrong ping value', async () => {
      /* Set up mocks */
      Object.defineProperty(mongoose, 'connections', {
        get: jest.fn().mockReturnValue([
          {
            readyState: 1, // Simulate connected state
            db: {
              admin: () => ({
                ping: jest.fn().mockResolvedValue({ ok: 1 })
              })
            }
          }
        ])
      });
      RedisClient.getClient = jest.fn().mockReturnValueOnce({
        ping: jest.fn().mockResolvedValueOnce(REDIS_PING_SUCCESS) // Default to success
      });
      admin.auth().createCustomToken = jest.fn().mockResolvedValueOnce(undefined);

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HealthCheckResponses._503_Failure);
    });
  });
});
