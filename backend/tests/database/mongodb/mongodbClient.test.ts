/* Unit tests for the mongodb client */
import mongoose from 'mongoose';
import MongodbClient from '../../../src/database/mongodb/mongodbClient';

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
});
