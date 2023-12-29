/* Unit tests for the auth routes */
import request from 'supertest';
import AuthController from '../../src/controllers/authController';
import { ROUTE_URLS_V1 } from '../../src/constants/routeUrls';
import App from '../../src/app'

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
    await request(appInstance.express).post(`${ROUTE_URLS_V1.AUTH_ROUTE}/register`).send({});
    expect(AuthController.register).toHaveBeenCalled();
  });
});
