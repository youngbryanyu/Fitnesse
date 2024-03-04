import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';

/* Base dio HTTP client */
class HttpClient {
  /* Dio Client singleton instance */
  static final HttpClient _singleton = HttpClient._internal();

  factory HttpClient() {
    return _singleton;
  }

  HttpClient._internal();

  /* Get getter for singleton instance */
  Dio get instance => _createDioInstance();

  Dio _createDioInstance() {
    final dio = Dio(
      BaseOptions(
        baseUrl: 'https://fitnesse-backend.onrender.com/v1',
      ),
    );

    /* Add interceptor to auto-add access token to HTTP requests */
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        /* Attach firebase id token to `authorization` header */
        String? token = await _getFirebaseIdToken();
        if (token != null) {
          options.headers['authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        /* Handle responses */
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        /* Handle errors */
        return handler.next(e);
      },
    ));

    return dio;
  }

  /* Get the firebase id token from the current user */
  Future<String?> _getFirebaseIdToken() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      final token = await user.getIdToken();
      return token;
    }
    return null;
  }
}
