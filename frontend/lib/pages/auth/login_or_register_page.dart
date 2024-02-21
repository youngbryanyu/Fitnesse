/* Determines whether to go to the login page or register page */
import 'package:flutter/material.dart';
import 'package:frontend/pages/auth/login_page.dart';
import 'package:frontend/pages/auth/register_page.dart';

class LoginOrRegisterPage extends StatefulWidget {
  const LoginOrRegisterPage({super.key});

  @override
  State<LoginOrRegisterPage> createState() => _LoginOrRegisterPageState();
}

class _LoginOrRegisterPageState extends State<LoginOrRegisterPage> {
  /* Initially show register page */
  bool showLoginPage = false;

  /* Toggle between login and register page */
  void togglePages() {
    setState(() {
      showLoginPage = !showLoginPage;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (showLoginPage) {
      return LoginPage(
        onTap: togglePages,
      );
    } else {
      return RegisterPage(
        onTap: togglePages,
      );
    }

    // TODO: add password reset page
  }
}
