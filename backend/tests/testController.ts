import { Request, Response } from 'express';

/**
 * A test controller class
 */
export class TestController {
  /**
   * A test function for testing purposes.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  static async testFunction(req: Request, res: Response): Promise<void> {
    /* Response will default to 200 status code */
    return;
  }
}
