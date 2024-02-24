/* Unit tests for the mongodb client */
import mongoose from 'mongoose';
import MongodbClient from '../../../src/database/mongodb/mongodbClient';
import logger from '../../../src/logging/logger';

describe('MongodbClient Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should successfully connect to MongoDB', async () => {
      /* Set up mocks */
      jest.spyOn(mongoose, 'connect').mockImplementation(() => {
        return { close: jest.fn() } as unknown as Promise<typeof import('mongoose')>;
      });

      /* Connect to DB */
      await MongodbClient.initialize();

      /* Test against expected */
      expect(mongoose.connect).toHaveBeenCalled();
    });

    it('should catch and throw any errors if failed connecting to MongoDB', async () => {
      /* Set up mocks */
      jest.spyOn(mongoose, 'connect').mockImplementation(() => {
        throw new Error('Test');
      });

      /* Connect to DB and test against expected */
      expect.assertions(1);
      try {
        await MongodbClient.initialize();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('reset', () => {
    it('should successfully disconnect from MongoDB', async () => {
      /* Set up mocks */
      jest
        .spyOn(mongoose, 'connect')
        .mockResolvedValueOnce({ close: jest.fn() } as unknown as Promise<
          typeof import('mongoose')
        >);
      jest.spyOn(mongoose, 'disconnect').mockResolvedValueOnce(undefined);

      /* Call functions */
      await MongodbClient.initialize();
      await MongodbClient.reset();

      /* Test against expected */
      expect(mongoose.disconnect).toHaveBeenCalled();
    });

    it('should fail if disconnecting from MongoDB fails', async () => {
      /* Set up mocks */
      jest.spyOn(mongoose, 'disconnect').mockImplementation(() => {
        throw new Error('Test');
      });
      jest.spyOn(logger, 'error');

      /* Call functions */
      await MongodbClient.reset();

      /* Test against expected */
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
