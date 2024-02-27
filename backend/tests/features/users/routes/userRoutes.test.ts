/* Unit tests for the health check routes */
import request from 'supertest';
import { ApiUrlsV1, GenericResponseMessages } from '../../../../src/features/common/constants';
import App from '../../../../src/app';
import Config from 'simple-app-config';
import UserController from '../../../../src/features/users/controllers/userController';

/* Mock the controller functions */
jest.mock('../../../../src/features/users/controllers/userController', () => ({
  createUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  }),
  updateUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  })
}));
jest.mock('../../../../src/features/auth/controllers/authController', () => ({
  verify: jest.fn().mockImplementation((req, res, next) => {
    next();
  }),
  checkAccess: jest.fn().mockImplementation((req, res, next) => {
    next();
  })
}));

describe('User Routes Tests', () => {
  let appInstance: App;

  beforeAll(() => {
    appInstance = new App();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /users', () => {
    it('should call UserController.createUser', async () => {
      /* Make the API call */
      const expressInstance = appInstance.getExpressApp();
      await request(expressInstance).post(`${ApiUrlsV1.Users}`).send({});

      /* Test against expected */
      expect(UserController.createUser).toHaveBeenCalled();
    });

    it('should fail when the rate limit is exceeded', async () => {
      /* Call API `threshold` times so that next call will cause rating limiting */
      const expressInstance = appInstance.getExpressApp();
      const threshold: number = Config.get('RATE_LIMITING.USERS.POST.THRESHOLD');
      for (let i = 0; i < threshold; i++) {
        await request(expressInstance).post(`${ApiUrlsV1.Users}`).send({});
      }

      /* Call API */
      const response = await request(expressInstance).post(`${ApiUrlsV1.Users}`).send({});

      /* Test against expected */
      expect(UserController.createUser).toHaveBeenCalledTimes(threshold);
      expect(response.statusCode).toBe(429);
      expect(response.body.message).toBe(GenericResponseMessages._429);
    });
  });
});
