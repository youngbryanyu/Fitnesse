/* Unit tests for the health check routes */
import request from 'supertest';
import { API_URLS_V1, GENERIC_RESPONSES } from '../../../src/constants';
import App from '../../../src/app';
import Config from 'simple-app-config';
import HealthCheckController from '../../../src/healthCheck/controllers/healthCheckController';

/* Mock the controller functions */
jest.mock('../../../src/healthCheck/controllers/healthCheckController', () => ({
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
      await request(expressInstance).get(`${API_URLS_V1.HEALTH_CHECK}/healthCheck`).send({});

      /* Test against expected */
      expect(HealthCheckController.checkHealth).toHaveBeenCalled();
    });

    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const expressInstance = appInstance.getExpressApp();
      const threshold: number = Config.get('RATE_LIMITING.HEALTH_CHECKS.HEALTH_CHECK.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(expressInstance).get(`${API_URLS_V1.HEALTH_CHECK}/healthCheck`).send({});
      }

      /* Call API */
      const response = await request(expressInstance)
        .get(`${API_URLS_V1.HEALTH_CHECK}/healthCheck`)
        .send({});

      /* Test against expected */
      expect(HealthCheckController.checkHealth).toHaveBeenCalled();
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(GENERIC_RESPONSES[429]);
    });
  });
});
