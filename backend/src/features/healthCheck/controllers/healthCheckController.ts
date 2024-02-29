/* Business logic for application health checks */
import { Request, Response } from 'express';
import mongoose, { STATES } from 'mongoose';
import { HealthCheckResponses, REDIS_PING_SUCCESS } from '../constants';
import logger from '../../../logging/logger';
import RedisClient from '../../../database/redis/redisClient';
import admin from 'firebase-admin';

/**
 * Business logic for application health checks
 */
class HealthCheckController {
  /**
   * Performs sanity checks to determine if the app is healthy
   * @param req incoming request from client.
   * @param res response to return to client.
   * @returns Returns a promise indicating completion of the async function.
   */
  static async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      /* Check if all MongoDB connections pass the ping check */
      for (const connection of mongoose.connections) {
        if (connection.readyState === STATES.connected) {
          const mongodbPing = await connection.db.admin().ping();
          if (mongodbPing['ok'] != STATES.connected) {
            throw new Error(
              `MongoDB ping failed. Expected response to be {"ok":1}, but received ${JSON.stringify(mongodbPing)}`
            );
          }
        }
      }

      /* Check if redis ping is successful */
      const redisPing = await RedisClient.getClient().ping();
      if (redisPing !== REDIS_PING_SUCCESS) {
        throw new Error(
          `Redis ping failed. Expected response to be ${REDIS_PING_SUCCESS}, but received ${redisPing}`
        );
      }

      /* Check if firebase ping is successful */
      const token = await admin.auth().createCustomToken('test_id');
      if (!token) {
        throw new Error(`Firebase connection check failed. Couldn't create a custom token`);
      }

      /* Response to client */
      res.status(200).json({
        message: HealthCheckResponses._200_Success
      });
    } catch (error) {
      logger.error('Error occured during database health check (failure): ' + error);
      res.status(503).json({
        message: HealthCheckResponses._503_Failure
      });
    }
  }
}

export default HealthCheckController;
