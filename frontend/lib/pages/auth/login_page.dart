/* The login page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/components/auth/auth_button.dart';
import 'package:frontend/components/auth/auth_error_popup.dart';
import 'package:frontend/components/auth/auth_text_field.dart';
import 'package:frontend/providers/auth/auth_providers.dart';
// import 'package:frontend/components/auth/auth_logo_tile.dart';
// import 'package:frontend/services/auth/auth_service.dart';

/* Login page widget */
class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  /* Text box controllers */
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  /* whether to show password */
  bool passwordVisible = false;

  /* Sign in function */
  Future<void> signInUser() async {
    /* Show loading circle */
    showDialog(
      context: context,
      builder: (context) {
        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );

    try {
      /* Await sign in */
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: emailController.text,
        password: passwordController.text,
      );

      /* Pop loading circle */
      if (mounted) {
        Navigator.pop(context);
      }

      /* Switch to home page */
      ref.read(authPageStateProvider.notifier).state = AuthPageState.home;
    } on FirebaseAuthException catch (error) {
      /* Pop loading circle */
      if (mounted) {
        Navigator.pop(context);
      }

      /* Handle error codes */
      if (error.code == 'too-many-requests') {
        showErrorPopup(
          'Account temporarily locked',
          'Too many failed login attempts. Try again later or reset your password.',
        );
      } else if (error.code == 'user-disabled') {
        showErrorPopup('Account locked', 'Your account is disabled.');
      } else if (error.code == 'operation-not-allowed') {
        showErrorPopup(
          'Login failed',
          'Email-based login is currently disabled',
        );
      } else {
        /* Group other errors together (e.g. invalid password, no user found, invalid email)*/
        showErrorPopup('Login failed', 'Invalid login credentials');
      }
    } catch (error) {
      showErrorPopup('Login failed', 'Server error occurred');
    }
  }

  /* Shows an error message popup */
  void showErrorPopup(String title, String message) {
    showDialog(
      context: context,
      builder: (context) {
        return AuthErrorPopup(title: title, message: message);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    /* Get the screen height */
    double screenHeight = MediaQuery.of(context).size.height;
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.background,
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    /* Welcome text*/
                    Text(
                      'Log in',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: screenHeight * .02),

                    /* Username or email text field */
                    AuthTextField(
                      controller: emailController,
                      hintText: 'Email',
                      obscureText: false,
                    ),
                    SizedBox(height: screenHeight * .01),

                    /* Password text field */
                    AuthTextField(
                      controller: passwordController,
                      hintText: 'Password',
                      obscureText: !passwordVisible,
                      suffixIcon: Icon(
                        passwordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                        color: Theme.of(context).colorScheme.surface,
                      ),
                      onTap: () {
                        // Handle the icon tap
                        setState(() {
                          passwordVisible = !passwordVisible;
                        });
                      },
                    ),

                    SizedBox(height: screenHeight * .01),

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
                    SizedBox(height: screenHeight * .03),

                    /* Sign in button */
                    AuthButton(
                      onTap: signInUser,
                      message: 'Log In',
                    ),
                    SizedBox(height: screenHeight * .03),

                    /* Continue with other login options */
                    // Padding(
                    //   padding: const EdgeInsets.symmetric(horizontal: 25),
                    //   child: Row(
                    //     children: [
                    //       Expanded(
                    //         child: Divider(
                    //           thickness: 0.5,
                    //           color: Theme.of(context).colorScheme.surface,
                    //         ),
                    //       ),
                    //       Padding(
                    //         padding: const EdgeInsets.symmetric(horizontal: 10),
                    //         child: Text(
                    //           'Or continue with',
                    //           style: TextStyle(
                    //             color: Theme.of(context).colorScheme.surface,
                    //           ),
                    //         ),
                    //       ),
                    //       Expanded(
                    //         child: Divider(
                    //           thickness: 0.5,
                    //           color: Theme.of(context).colorScheme.surface,
                    //         ),
                    //       ),
                    //     ],
                    //   ),
                    // ),
                    // SizedBox(height: screenHeight * .03),

                    /* 3P sign in buttons */
                    // Row(
                    //   mainAxisAlignment: MainAxisAlignment.center,
                    //   children: [
                    //     /* Google button */
                    //     LogoTile(
                    //       imagePath: 'lib/images/google-logo.png',
                    //       onTap: () => AuthService(context).signInWithGoogle(),
                    //     ),
                    //   ],
                    // ),
                    // SizedBox(height: screenHeight * .03),

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
                        SizedBox(width: screenWidth * .01),
                        GestureDetector(
                          onTap: () {
                            ref.read(authPageStateProvider.notifier).state =
                                AuthPageState.register;
                          },
                          child: Text(
                            'Register now',
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onBackground,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    // SizedBox(height: screenHeight * .01),
                  ]),
            ),
          ),
        ));
  }
}
