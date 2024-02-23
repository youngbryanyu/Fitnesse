import Config from 'simple-app-config';
import { createClient, RedisClientType } from 'redis';
import logger from '../logging/logger';

/**
 * Client class used to interact with redis
 */
class RedisClient {
  private static client: RedisClientType | undefined = undefined;

  /**
   * Connects to the redis instance and awaits for a connection.
   * @returns a promise indicating completion of the async operation.
   */
  public static async initialize(): Promise<void> {
    /* Check if client is already initialized */
    if (RedisClient.client !== undefined) {
      return;
    }

    try {
      /* Get connection secrets */
      const host = Config.get('REDIS.HOST') as string;
      const password = Config.get('REDIS.PASSWORD') as string;
      const port = Config.get('REDIS.PORT') as number;

      /* Connect to redis instance */
      RedisClient.client = await createClient({
        password: password,
        socket: {
          host: host,
          port: port
        }
      });
      await RedisClient.client.connect();
      logger.info('Successfully connected to Redis');
    } catch (error) {
      logger.error('Error connecting to redis:\n', error);
      throw error;
    }
  }

  /**
   * Returns the Redis client.
   * @returns The Redis client.
   */
  public static getClient(): RedisClientType {
    if (!RedisClient.client) {
      logger.error('The redis client has no been initialized yet');
      throw new Error('Redis client not initialized yet.');
    }
    return RedisClient.client;
  }
}

export default RedisClient;
