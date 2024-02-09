/* Unit tests for the auth routes */
import request from 'supertest';
import AuthController from '../../src/controllers/authController';
import { API_URLS_V1, AUTH_RESPONSES } from '../../src/constants';
import App from '../../src/app';
import Config from 'simple-app-config';

/* Mock the API endpoints to do nothing */
jest.mock('../../src/controllers/authController', () => ({
  register: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(201);
  }),
  login: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  }),
  logout: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  })
}));

describe('Auth Routes Tests', () => {
  let appInstance: App;

  beforeAll(() => {
    appInstance = new App();
    appInstance.initializeMiddleWares();
    appInstance.mountRoutes();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /register', () => {
    it('should call AuthController.register', async () => {
      /* Make the API call */
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});

      /* Test against expected */
      expect(AuthController.register).toHaveBeenCalled();
    });

    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const threshold: number = Config.get('RATE_LIMITING.AUTH.REGISTER.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
      }

      /* Call API */
      const response = await request(appInstance.express)
        .post(`${API_URLS_V1.AUTH}/register`)
        .send({});

      /* Test against expected */
      expect(AuthController.register).toHaveBeenCalled();
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
    });
  });

  describe('POST /login', () => {
    it('should call AuthController.register', async () => {
      /* Make the API call */
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/login`).send({});

      /* Test against expected */
      expect(AuthController.login).toHaveBeenCalled();
    });

    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const threshold: number = Config.get('RATE_LIMITING.AUTH.LOGIN.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(appInstance.express).post(`${API_URLS_V1.AUTH}/login`).send({});
      }

      /* Call API */
      const response = await request(appInstance.express)
        .post(`${API_URLS_V1.AUTH}/login`)
        .send({});

      /* Test against expected */
      expect(AuthController.login).toHaveBeenCalled();
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
    });
  });

  describe('DELETE /logout', () => {
    it('should call AuthController.logout', async () => {
      /* Make the API call */
      await request(appInstance.express).delete(`${API_URLS_V1.AUTH}/logout`).send({});

      /* Test against expected */
      expect(AuthController.logout).toHaveBeenCalled();
    });

    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const threshold: number = Config.get('RATE_LIMITING.AUTH.LOGOUT.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(appInstance.express).delete(`${API_URLS_V1.AUTH}/logout`).send({});
      }

      /* Call API */
      const response = await request(appInstance.express)
        .delete(`${API_URLS_V1.AUTH}/logout`)
        .send({});

      /* Test against expected */
      expect(AuthController.logout).toHaveBeenCalled();
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
    });
  });
});
