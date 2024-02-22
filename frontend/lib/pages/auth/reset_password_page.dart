/* The login page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:frontend/components/auth/auth_button.dart';
import 'package:frontend/components/auth/auth_error_popup.dart';
import 'package:frontend/components/auth/auth_text_field.dart';

/* Login page widget */
class ResetPasswordPage extends StatefulWidget {
  final Function()? onTap;
  const ResetPasswordPage({super.key, required this.onTap});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
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
                    /* Welcome text*/
                    Text(
                      'Reset Password',
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

                    /* Send email button */
                    AuthButton(
                      onTap: signInUser,
                      message: 'Send password reset email',
                    ),
                    SizedBox(height: screenHeight * .03),

                    /* Back button */
                    AuthButton(
                      onTap: signInUser,
                      message: 'Back',
                    ),
                    SizedBox(height: screenHeight * .03),
                  ]),
            ),
          ),
        ));
  }
}
