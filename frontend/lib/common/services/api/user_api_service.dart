import 'package:dio/dio.dart';
import 'package:frontend/common/http/http_client.dart';

/* Class for interacting with user related backend APIs */
class UserApiService {
  /* HTTP */
  final Dio dio = HttpClient().instance;

  /* Get a user */
  Future<void> getUser(String userId) async {
    try {
      final response = await dio.get('/users/$userId');

      // todo: check if user isn't null
      if (response.data['user'] != null) {
        var data = response.data['user'];
      }
    } catch (error) {
      /* Handle error */
    }
  }
}
