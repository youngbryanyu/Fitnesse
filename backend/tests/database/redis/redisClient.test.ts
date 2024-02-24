/* Unit tests for the redis client */
import Config from 'simple-app-config';
import RedisClient from '../../../src/database/redis/redisClient';

/* Mock redis package */
jest.mock('redis', () => jest.requireActual('redis-mock'));
import redis from 'redis';
import logger from '../../../src/logging/logger';

describe('RedisClient Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await RedisClient.reset();
  });

  describe('initialize', () => {
    it('should successfully connect to Redis', async () => {
      /* Set up mocks */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockResolvedValue(undefined), // Simulates successful connection
        quit: jest.fn().mockResolvedValue(undefined), // Simulates successful disconnection
        isReady: true // Simulates the client being ready
      }));

      /* Call function */
      await RedisClient.initialize();
      const client = RedisClient.getClient();

      /* Test against expected */
      expect(client.connect).toHaveBeenCalled();
    });

    it('should return if the client is already connected to Redis', async () => {
      /* Set up mocks */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockResolvedValue(undefined), // Simulates successful connection
        quit: jest.fn().mockResolvedValue(undefined), // Simulates successful disconnection
        isReady: true // Simulates the client being ready
      }));

      /* Call function twice */
      await RedisClient.initialize();
      await RedisClient.initialize();
      const client = RedisClient.getClient();

      /* Test against expected */
      expect(client.connect).toHaveBeenCalledTimes(1);
    });

    it('should catch and throw any errors if failed connecting to Redis', async () => {
      /* Set up mocks */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockImplementationOnce(() => {
          throw new Error();
        }),
        quit: jest.fn().mockResolvedValue(undefined),
        isReady: true
      }));

      jest.spyOn(Config, 'get');

      /* Call function twice */
      expect.assertions(1);
      try {
        await RedisClient.initialize();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('getClient', () => {
    it('should return the client if it has been initialized', async () => {
      /* Set up mocks */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn().mockResolvedValue(undefined),
        isReady: true
      }));

      /* Call function */
      await RedisClient.initialize();
      const client = RedisClient.getClient();

      /* Test against expected */
      expect(client).toBeDefined();
    });

    it('should throw an error if the client has not been initialized', async () => {
      expect(() => RedisClient.getClient()).toThrow(Error);
    });
  });

  describe('reset', () => {
    it('should call quit and disconnect from redis', async () => {
      /* Set up mocks */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn().mockResolvedValue(undefined),
        isReady: true
      }));

      /* Call function */
      await RedisClient.initialize();
      const client = RedisClient.getClient();
      await RedisClient.reset();

      /* Test against expected */
      expect(client.quit).toHaveBeenCalled();
    });

    it('should fail if disconnecting from redis fails', async () => {
      /* Set up mocks and spies */
      redis.createClient = jest.fn().mockImplementationOnce(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn().mockImplementationOnce(() => {
          throw new Error();
        }),
        isReady: true
      }));
      jest.spyOn(logger, 'error');

      /* Call function and test against expected */
      await RedisClient.initialize();
      await RedisClient.reset();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return if the client is not initialized', async () => {
      /* Call function and test against expected */
      expect.assertions(1);
      const result = await RedisClient.reset();
      expect(result).toBeUndefined();
    });
  });
});
