/* The login page */
import 'package:flutter/material.dart';
import 'package:frontend/components/auth/auth_button.dart';
import 'package:frontend/components/auth/auth_text_field.dart';

/* Login page widget */
class LoginPage extends StatelessWidget {
  LoginPage({super.key});

  /* Text editing controller */
  final usernameOrEmailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[300],
        body: SafeArea(
          child: Center(
            child: Column(children: [
              const SizedBox(height: 50),

              /* Logo */
              Image.asset(
                'lib/images/ontrack-light.png',
                height: 150,
                width: 150,
              ),
              const SizedBox(height: 50),

              /* Welcome text*/
              Text(
                'Welcome back to OnTrack!',
                style: TextStyle(color: Colors.grey[700], fontSize: 16),
              ),
              const SizedBox(height: 25),

              /* Username or email text field */
              AuthTextField(
                controller: usernameOrEmailController,
                hintText: 'Username or email',
                obscureText: false,
              ),
              const SizedBox(height: 10),

              /* Password text field */
              AuthTextField(
                controller: passwordController,
                hintText: 'Password',
                obscureText: true,
              ),
              const SizedBox(height: 10),

              /* Forgot password? */
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      'Forgot Password?',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 25),

              /* Sign in button */
              const AuthButton(),
            ]),
          ),
        ));
  }
}
