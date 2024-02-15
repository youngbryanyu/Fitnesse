import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import HealthCheckController from '../../src/controllers/healthCheckController';
import { HEALTH_CHECK_RESPONSES } from '../../src/constants';
import mongoose from 'mongoose';

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
                ping: jest.fn().mockResolvedValue(true)
              })
            }
          }
        ])
      });

      /* Make request */
      request = createRequest();
      await HealthCheckController.checkHealth(request, response);

      /* Test against expected */
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(HEALTH_CHECK_RESPONSES._200_SUCCESS);
    });

    it('should fail when not all databases are healthy', async () => {
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
      expect(response._getJSONData().message).toBe(HEALTH_CHECK_RESPONSES._503_FAILURE);
    });
  });
});
