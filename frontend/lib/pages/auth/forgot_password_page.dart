/* The login page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/components/auth/auth_button.dart';
import 'package:frontend/components/auth/auth_popup.dart';
import 'package:frontend/components/auth/auth_text_field.dart';
import 'package:frontend/providers/auth/auth_page_provider.dart';

/* Login page widget */
class ResetPasswordPage extends ConsumerStatefulWidget {
  const ResetPasswordPage({super.key});

  @override
  ConsumerState<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends ConsumerState<ResetPasswordPage> {
  /* Text box controllers */
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  /* whether to show password */
  bool passwordVisible = false;

  /* Sign in function */
  Future<void> sendResetPasswordEmail() async {
    // TODO: update
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
        return AuthPopup(title: title, message: message);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    /* Get the screen height */
    double screenHeight = MediaQuery.of(context).size.height;
    // double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.background,
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    /* Title text */
                    Text(
                      'Forgot your password?',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: screenHeight * .01),
                    Text(
                      'Enter your email below to receive',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 14,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    Text(
                      'a password reset email',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onBackground,
                        fontSize: 14,
                        fontWeight: FontWeight.normal,
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

                    /* Send email button */
                    AuthButton(
                      onTap: sendResetPasswordEmail,
                      message: 'Send',
                    ),
                    SizedBox(height: screenHeight * .01),

                    /* Back button */
                    AuthButton(
                      onTap: () {
                        ref.read(authPageStateProvider.notifier).state =
                            AuthPageState.login;
                      },
                      message: 'Back',
                    ),
                    SizedBox(height: screenHeight * .03),
                  ]),
            ),
          ),
        ));
  }
}
