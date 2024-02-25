/* Unit tests for the mongodb client */
import FirebaseClient from '../../../src/database/firebase/firebaseClient';
import admin from 'firebase-admin';
import logger from '../../../src/logging/logger';

/* Mock firebase-admin */
jest.mock('firebase-admin', () => {
  const deleteMock = jest.fn().mockResolvedValue(true);
  return {
    initializeApp: jest.fn(() => ({
      app: jest.fn(() => ({ delete: deleteMock }))
    })),
    app: jest.fn(() => ({
      delete: deleteMock
    })),
    credential: {
      cert: jest.fn().mockReturnValue({})
    }
  };
});

describe('FirebaseClient Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should successfully connect to Firebase', async () => {
      /* Connect to DB */
      FirebaseClient.initialize();

      /* Test against expected */
      expect(admin.initializeApp).toHaveBeenCalled();
    });

    it('should catch and throw any errors if failed connecting to Firebase', async () => {
      /* Set up mocks */
      admin.initializeApp = jest.fn().mockImplementationOnce(() => {
        throw new Error();
      });

      /* Connect to DB and test against expected*/
      expect(() => FirebaseClient.initialize()).toThrow(Error);
    });
  });

  describe('reset', () => {
    it('should successfully disconnect from Firebase', async () => {
      /* Call functions */
      FirebaseClient.initialize();
      const app = admin.app();
      await FirebaseClient.reset();

      /* Test against expected */
      expect(app.delete).toHaveBeenCalled();
    });

    it('should fail if disconnecting from Firebase fails', async () => {
      /* Set up mocks and spies */
      const deleteMock = jest.fn().mockImplementationOnce(() => {
        throw new Error('Failed to delete app');
      });
      admin.app = jest.fn().mockReturnValueOnce({ delete: deleteMock });
      jest.spyOn(logger, 'error');

      /* Call functions */
      FirebaseClient.initialize();
      await FirebaseClient.reset();

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
