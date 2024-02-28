/* Unit tests for the health check routes */
import request from 'supertest';
import { ApiUrlsV1 } from '../../../../src/features/common/constants';
import App from '../../../../src/app';
import HealthCheckController from '../../../../src/features/healthCheck/controllers/healthCheckController';

/* Mock the controller functions */
jest.mock('../../../../src/features/healthCheck/controllers/healthCheckController', () => ({
  checkHealth: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  })
}));

describe('Health Check Routes Tests', () => {
  let appInstance: App;

  beforeAll(() => {
    appInstance = new App();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /healthCheck', () => {
    it('should call HealthCheckController.checkHealth', async () => {
      /* Make the API call */
      const expressInstance = appInstance.getExpressApp();
      await request(expressInstance).get(`${ApiUrlsV1.HealthCheck}`).send({});

      /* Test against expected */
      expect(HealthCheckController.checkHealth).toHaveBeenCalled();
    });
  });
});
