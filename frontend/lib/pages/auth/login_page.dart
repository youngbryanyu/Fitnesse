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
    /* Determine whether to use dark or light mode for icons */
    final isDarkMode =
        MediaQuery.of(context).platformBrightness == Brightness.dark;
    final String appleLogoPath = isDarkMode
        ? 'lib/images/apple-logo-dark.png'
        : 'lib/images/apple-logo-light.png';
    final String onTrackLogoPath = isDarkMode
        ? 'lib/images/ontrack-logo-dark.png'
        : 'lib/images/ontrack-logo-light.png';

    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.background,
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 50),

                    /* Logo */
                    Image.asset(
                      onTrackLogoPath,
                      height: 150,
                      width: 150,
                    ),
                    const SizedBox(height: 25),

                    /* Welcome text*/
                    Text(
                      'Welcome to',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'OnTrack',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
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
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.secondary,
                            ),
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
                              color: Theme.of(context).colorScheme.surface,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              'Or continue with',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.surface,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              thickness: 0.5,
                              color: Theme.of(context).colorScheme.surface,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 50),

                    /* Google and Apple sign in buttons */
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        /* Google button */
                        const LogoTile(imagePath: 'lib/images/google-logo.png'),
                        const SizedBox(width: 25),

                        /* Apple button */
                        LogoTile(imagePath: appleLogoPath),
                      ],
                    ),
                    const SizedBox(height: 50),

                    /* Link to register page */
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Not a member?',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.surface,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Register now',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onBackground,
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
