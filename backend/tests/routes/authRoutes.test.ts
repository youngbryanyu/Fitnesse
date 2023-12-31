/* Unit tests for the auth routes */
import request from 'supertest';
import AuthController from '../../src/controllers/authController';
import { API_URLS_V1, AUTH_RESPONSES, RATE_LIMIT_DEFAULTS } from '../../src/config/constants';
import App from '../../src/app';

/* Mock the register function from the AuthController */
jest.mock('../../src/controllers/authController', () => ({
  register: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(201);
  })
}));

/* Test auth routes */
describe('Auth Routes Tests', () => {
  let appInstance: App;

  /* Initialize app instance before all tests */
  beforeAll(() => {
    appInstance = new App();
    appInstance.mountRoutes();
    appInstance.initializeMiddleWares();
  });

  /* Clear all mocks before each test */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* Test that the register controller function is called on POST /register */
  it('should call AuthController.register on POST /register', async () => {
    await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
    expect(AuthController.register).toHaveBeenCalled();
  });

  /* Test when the rate limit is exceeded for registering */
  it('should response with 429 when the rate limit is exceeded for POST /register', async () => {
    /* Call the API REGISTER_THRESHOLD number of times beforehand so the next call will trigger throttling */
    for (let i = 0; i < RATE_LIMIT_DEFAULTS.REGISTER_THRESHOLD; i++) {
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
    }
    
    /* Call API and check responses */
    const response = await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
    expect(AuthController.register).toHaveBeenCalled();
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
  });
});
