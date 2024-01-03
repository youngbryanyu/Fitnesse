/* Unit tests for the auth routes */
import request from 'supertest';
import AuthController from '../../src/controllers/authController';
import { API_URLS_V1, AUTH_RESPONSES } from '../../src/config/constants';
import App from '../../src/app';
import AppConfig from '../../src/config/appConfig';

/* Mock the register endpoint to do nothing */
jest.mock('../../src/controllers/authController', () => ({
  register: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(201); // Mock implementation
  }),
}));

/* Test auth routes */
describe('Auth Routes Tests', () => {
  let appInstance: App;

  /* Initialize app instance before all tests */
  beforeAll(() => {
    appInstance = new App();
    appInstance.initializeMiddleWares();
    appInstance.mountRoutes();
  });

  /* Clear all mocks before each test */
  beforeEach(() => {
    jest.clearAllMocks();
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
    /* Spy on console.log and mock to hide output */
    jest.spyOn(console, 'log').mockImplementationOnce(() => { return 0 }).mockImplementationOnce(() => { return 0 });
    
    /* Get register threshold from test .env file */
    const appConfig = new AppConfig();
    const threshold = appConfig.getConfigNumber('RATE_LIMITING.AUTH.REGISTER.THRESHOLD');

    /* Call API `threshold` times so that next call will cause rating limiting */
    for (let i = 0; i < threshold; i++) {
      await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});
    }

    /* Call API to trigger rate limiting */
    const response = await request(appInstance.express).post(`${API_URLS_V1.AUTH}/register`).send({});

    /* Make checks */
    expect(AuthController.register).toHaveBeenCalled();
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(AUTH_RESPONSES._429_RATE_LIMIT_EXCEEDED);
  });
});
