/* Unit tests for the redis client */
import RedisClient from '../../../src/database/redis/redisClient';

/* Mock redis package */
jest.mock('redis', () => jest.requireActual('redis-mock'));
import redis from 'redis';

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
        }), // Simulates successful connection
        quit: jest.fn().mockResolvedValue(undefined), // Simulates successful disconnection
        isReady: true // Simulates the client being ready
      }));

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
        connect: jest.fn().mockResolvedValue(undefined), // Simulates successful connection
        quit: jest.fn().mockResolvedValue(undefined), // Simulates successful disconnection
        isReady: true // Simulates the client being ready
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
        connect: jest.fn().mockResolvedValue(undefined), // Simulates successful connection
        quit: jest.fn().mockResolvedValue(undefined), // Simulates successful disconnection
        isReady: true // Simulates the client being ready
      }));

      /* Call function */
      await RedisClient.initialize();
      const client = RedisClient.getClient();
      await RedisClient.reset();

      /* Test against expected */
      expect(client.quit).toHaveBeenCalled();
    });
  });
});
