import { Request, Response } from 'express';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import HealthCheckController from '../../src/controllers/healthCheckController';
import { HEALTH_CHECK_RESPONSES } from '../../src/constants';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Health Check Controller Tests', () => {
  let request: MockRequest<Request>;
  let response: MockResponse<Response>;
  let mongoServer: MongoMemoryServer;
  let uri: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(() => {
    response = createResponse();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('checkHealth', () => {
    it('should succeed if all DB connections are healthy', async () => {
      /* Create mock request */
      request = createRequest();

      /* Set up mocks */
      mongoose.mongo.Admin.prototype.ping = jest.fn().mockResolvedValueOnce(true);

      /* Test against expected */
      await HealthCheckController.checkHealth(request, response);
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData().message).toBe(HEALTH_CHECK_RESPONSES._200_SUCCESS);
    });

    it("should fail if any DB connections aren't healthy", async () => {
      /* Create mock request */
      request = createRequest();

      /* Set up mocks*/
      mongoose.mongo.Admin.prototype.ping = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to ping'));

      /* Test against expected */
      await HealthCheckController.checkHealth(request, response);
      expect(response.statusCode).toBe(503);
      expect(response._getJSONData().message).toBe(HEALTH_CHECK_RESPONSES._503_FAILURE);
    });
  });
});
