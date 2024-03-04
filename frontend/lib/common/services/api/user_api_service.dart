import 'package:dio/dio.dart';
import 'package:frontend/common/http/http_client.dart';
import 'package:frontend/logging/logger.dart';

/* Class for interacting with user related backend APIs */
class UserApiService {
  /* HTTP client */
  static final Dio dio = HttpClient.instance;

  /* Get a user */
  static Future<Map<String, dynamic>?> getUser(String userId) async {
    try {
      /* Make HTTP request */
      final response = await dio.get('/users/$userId');

      /* Return user if status code is 200 */
      if (response.statusCode == 200) {
        return response.data['user'];
      } else {
        return null;
      }

      // TODO: handle 500 status code
    } catch (error) {
      appLogger.info('Error while getting user from the backend:\n', error);
      rethrow;
    }
  }
}
