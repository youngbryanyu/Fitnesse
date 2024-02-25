import Config from 'simple-app-config';
import logger from '../../logging/logger';
import mongoose from 'mongoose';

/**
 * Client class used to connect to MongoDB
 */
class MongodbClient {
  /**
   * Connects to the MongoDB instance and awaits for a connection.
   * @returns a promise indicating completion of the async operation.
   */
  public static async initialize(): Promise<void> {
    try {
      /* Get connection secrets */
      const connectionUrl: string = Config.get('MONGO_DB.CONNECTION_URL');

      /* Connect to mongodb instance */
      await mongoose.connect(connectionUrl);
      logger.info('Successfully connected to MongoDB');
    } catch (error) {
      logger.error('Error occurred while connecting to MongoDB:\n', error);
      throw error;
    }
  }

  /**
   * Disconnects from the MongoDB instance.
   */
  public static async reset(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      logger.error('Failed to disconnect gracefully from MongoDB:\n', error);
    }
  }
}

export default MongodbClient;
