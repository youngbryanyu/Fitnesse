/* Unit tests for the health check routes */
import request from 'supertest';
import { ApiUrlsV1, GenericResponseMessages } from '../../../../src/features/common/constants';
import App from '../../../../src/app';
import Config from 'simple-app-config';
import HealthCheckController from '../../../../src/features/healthCheck/controllers/healthCheckController';

/* Mock the controller functions */
jest.mock('../../../../src/features/healthCheck/controllers/healthCheckController', () => ({
  checkHealth: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  })
}));

describe('Health Check Rate Limit Tests', () => {
  let appInstance: App;

  beforeAll(() => {
    appInstance = new App();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /healthCheck', () => {
    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const expressInstance = appInstance.getExpressApp();
      const threshold: number = Config.get('RATE_LIMITING.HEALTH_CHECK.GET.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(expressInstance).get(`${ApiUrlsV1.HealthCheck}`).send({});
      }

      /* Call API */
      const response = await request(expressInstance).get(`${ApiUrlsV1.HealthCheck}`).send({});

      /* Test against expected */
      expect(HealthCheckController.checkHealth).toHaveBeenCalledTimes(threshold);
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(GenericResponseMessages._429);
    });
  });
});
