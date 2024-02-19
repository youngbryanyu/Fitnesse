/* The login page */
import 'package:flutter/material.dart';
import 'package:frontend/components/auth/auth_button.dart';
import 'package:frontend/components/auth/auth_text_field.dart';
import 'package:frontend/components/auth/logo_tile.dart';

/* Login page widget */
class LoginPage extends StatelessWidget {
  LoginPage({super.key});

  /* Text editing controller */
  final usernameOrEmailController = TextEditingController();
  final passwordController = TextEditingController();

  /* Sign in function */
  void signInUser() {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[300],
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                    AuthButton(
                      onTap: signInUser,
                    ),
                    const SizedBox(height: 50),

                    /* Continue with other login options */
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 25),
                      child: Row(
                        children: [
                          Expanded(
                            child: Divider(
                              thickness: 0.5,
                              color: Colors.grey[400],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              'Or continue with',
                              style: TextStyle(color: Colors.grey[700]),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              thickness: 0.5,
                              color: Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 50),

                    /* Google and Apple sign in buttons */
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        /* Google button */
                        LogoTile(imagePath: 'lib/images/google-logo.png'),
                        SizedBox(width: 25),

                        /* Apple button */
                        LogoTile(imagePath: 'lib/images/apple-logo.png'),
                      ],
                    ),
                    const SizedBox(height: 50),

                    /* Link to register page */
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Not a member?'),
                        SizedBox(width: 4),
                        Text(
                          'Register now',
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ]),
            ),
          ),
        ));
  }
}
