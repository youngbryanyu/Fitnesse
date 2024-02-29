import Config from 'simple-app-config';
import admin from 'firebase-admin';
import logger from '../../logging/logger';

/**
 * Client class used to connect to firebase
 */
class FirebaseClient {
  /**
   * Creates a firebase client to make HTTP requests to firebase
   */
  public static initialize(): void {
    try {
      /* Get connection secrets */
      const projectId = Config.get('FIREBASE.PROJECT_ID') as string;
      const clientEmail = Config.get('FIREBASE.CLIENT_EMAIL') as string;
      const privateKey = (Config.get('FIREBASE.PRIVATE_KEY') as string).replace(/\\n/g, '\n');

      /* Create firebase connection */
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey
        })
      });
      logger.info('Successfully initialized Firebase client');
    } catch (error) {
      logger.error('Error occurred while connecting to Firebase:\n', error);
      throw error;
    }
  }

  /**
   * Clean up the firebase client.
   */
  public static async reset() {
    try {
      if (admin.apps.length > 0) {
        await admin.app().delete();
      }
    } catch (error) {
      logger.error('Failed to disconnect gracefully from Firebase:\n', error);
    }
  }
}

export default FirebaseClient;
