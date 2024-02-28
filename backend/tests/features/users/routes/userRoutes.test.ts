/* Unit tests for the health check routes */
import request from 'supertest';
import { ApiUrlsV1 } from '../../../../src/features/common/constants';
import App from '../../../../src/app';
import UserController from '../../../../src/features/users/controllers/userController';

/* Mock user controller functions */
jest.mock('../../../../src/features/users/controllers/userController', () => ({
  createUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  }),
  updateUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  }),
  getUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  }),
  deleteUser: jest.fn().mockImplementation((req, res) => {
    res.sendStatus(200);
  })
}));

/* Mock auth controller */
jest.mock('../../../../src/features/auth/controllers/authController', () => ({
  verify: jest.fn().mockImplementation((req, res, next) => {
    next();
  }),
  checkAccess: jest.fn().mockImplementation((req, res, next) => {
    next();
  })
}));

describe('Users Routes Tests', () => {
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
  });

  describe('PUT /users/:id', () => {
    it('should call UserController.updateUser', async () => {
      /* Make the API call */
      const expressInstance = appInstance.getExpressApp();
      await request(expressInstance).put(`${ApiUrlsV1.Users}/1`).send({});

      /* Test against expected */
      expect(UserController.updateUser).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should call UserController.getUser', async () => {
      /* Make the API call */
      const expressInstance = appInstance.getExpressApp();
      await request(expressInstance).get(`${ApiUrlsV1.Users}/1`).send({});

      /* Test against expected */
      expect(UserController.getUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should call UserController.deleteUser', async () => {
      /* Make the API call */
      const expressInstance = appInstance.getExpressApp();
      await request(expressInstance).delete(`${ApiUrlsV1.Users}/1`).send({});

      /* Test against expected */
      expect(UserController.deleteUser).toHaveBeenCalled();
    });
  });
});
