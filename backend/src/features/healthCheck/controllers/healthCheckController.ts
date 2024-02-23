/* Business logic for application health checks */
import { Request, Response } from 'express';
import mongoose, { STATES } from 'mongoose';
import { HealthCheckResponses } from '../constants';
import logger from '../../../logging/logger';

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
          await connection.db.admin().ping();
        }
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
