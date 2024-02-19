/* Entry point into the frontend */
import 'package:flutter/material.dart';
import 'pages/auth/login_page.dart';

/* Starts the app */
void main() {
  runApp(const App());
}

/* Main app widget */
class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
    );
  }
}
