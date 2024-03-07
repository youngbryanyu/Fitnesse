import 'package:dio/dio.dart';
import 'package:frontend/common/http/http_client.dart';
import 'package:frontend/logging/logger.dart';
import 'package:intl/intl.dart';

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
        if (response.statusCode == 500) {
          // TODO: handle 500 status code
        }
        // TODO: handle other status codes
        return null;
      }
    } catch (error) {
      appLogger.info(
          'Error occurred during GET /users/:userId request:\n', error);
      rethrow;
    }
  }

  static Future<void> createUser({
    required String userId,
    required DateTime birthday,
    required int sex,
    required int height,
    required int weight,
    required int activityLevel,
    required int weightGoal,
    required bool userMetric,
  }) async {
    // TODO: create function to compute recommended macros
    try {
      /* Call POST API */
      final response = await dio.post(
        '/users',
        data: {
          'userId': userId,
          'birthday': DateFormat('yyyy-MM-dd').format(birthday.toUtc()),
          'sex': sex,
          'height': height,
          'weight': weight,
          'activityLevel': activityLevel,
          'weightGoal': weightGoal,
          'useMetric': userMetric,
          'goals': {
            'calories': 2000,
            'protein': 200,
            'fat': 60,
            'carbohydrates': 200,
          },
          'updatedAt': DateTime.now().toUtc().toIso8601String(),
          'createdAt': DateTime.now().toUtc().toIso8601String(),
        },
      );

      if (response.statusCode == 201) {
        /* Success, do nothing */
      } else if (response.statusCode == 500) {
        /* TODO: handle all status codes */
      } else {
        throw Error();
      }
    } catch (error) {
      // TODO: handle errors
      appLogger.info('Error occurred during POST /users request:\n', error);
      rethrow;
    }
  }
}
