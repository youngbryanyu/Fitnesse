/* Unit tests for the auth routes */
import request from 'supertest';
import AuthController from '../../src/controllers/authController';
import { API_URLS_V1, AUTH_RESPONSES } from '../../src/constants';
import App from '../../src/app';
import Config from 'simple-app-config';

/* Mock the register endpoint to do nothing */
jest.mock('../../src/controllers/authController', () => ({
  register: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(201); // Mock implementation
  }),
  login: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(201); // Mock implementation
  })
}));

/* Test auth routes */
describe('Auth Routes Tests', () => {
  let appInstance: App;

  /* Setup before all tests */
  beforeAll(() => {
    /* Initialize app instance and call setup functions before all tests */
    appInstance = new App();
    appInstance.initializeMiddleWares();
    appInstance.mountRoutes();
  });

  /* Setup before each test */
  beforeEach(() => {
    /* Restore all mock states */
    jest.restoreAllMocks();
  });

  /* Test that the register controller function is called on POST /register */
  it('should call AuthController.register on POST /register', async () => {
    /* Make the API call */
    await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});

    /* Check that the register controller was called*/
    expect(AuthController.register).toHaveBeenCalled();
  });

  /* Test when the rate limit is exceeded for registering */
  it('should response with 429 when the rate limit is exceeded for POST /register', async () => {
    /* Get register threshold from test .env file */
    const threshold: number = Config.get('RATE_LIMITING.AUTH.REGISTER.THRESHOLD');

    /* Call API `threshold` times so that next call will cause rating limiting */
    for (let i = 0; i < threshold; i++) {
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
    }

    /* Call API to trigger rate limiting */
    const response = await request(appInstance.express)
      .post(`${API_URLS_V1.AUTH}/register`)
      .send({});

    /* Make checks */
    expect(AuthController.register).toHaveBeenCalled();
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
  });

  /* Test that the login controller function is called on POST /login */
  it('should call AuthController.register on POST /register', async () => {
    /* Make the API call */
    await request(appInstance.express).post(`${API_URLS_V1.AUTH}/login`).send({});

    /* Check that the register controller was called*/
    expect(AuthController.login).toHaveBeenCalled();
  });

  /* Test when the rate limit is exceeded for registering */
  it('should response with 429 when the rate limit is exceeded for POST /login', async () => {
    /* Get register threshold from test .env file */
    const threshold: number = Config.get('RATE_LIMITING.AUTH.LOGIN.THRESHOLD');

    /* Call API `threshold` times so that next call will cause rating limiting */
    for (let i = 0; i < threshold; i++) {
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/login`).send({});
    }

    /* Call API to trigger rate limiting */
    const response = await request(appInstance.express).post(`${API_URLS_V1.AUTH}/login`).send({});

    /* Make checks */
    expect(AuthController.login).toHaveBeenCalled();
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
  });
});
