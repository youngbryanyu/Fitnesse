/* The login page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/auth/components/auth_button.dart';
import 'package:frontend/common/components/popup_dialog.dart';
import 'package:frontend/features/auth/components/auth_text_field.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';

/* Login page widget */
class ResetPasswordPage extends ConsumerStatefulWidget {
  const ResetPasswordPage({super.key});

  @override
  ConsumerState<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends ConsumerState<ResetPasswordPage> {
  /* Text box controllers */
  final emailController = TextEditingController();

  /* whether to show password */
  bool passwordVisible = false;

  /* Sign in function */
  Future<void> sendResetPasswordEmail() async {
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
      /* Await send email */
      await FirebaseAuth.instance.sendPasswordResetEmail(
        email: emailController.text,
      );

      if (mounted) {
        /* Pop loading circle */
        Navigator.pop(context);

        /* Show popup and clear controller */
        showAuthPopup(
          context,
          "Email sent successfully",
          "Please check your email for steps on how to reset your password",
        );
      }
      emailController.text = '';
    } on FirebaseAuthException catch (error) {
      /* Pop loading circle */
      if (mounted) {
        Navigator.pop(context);
      }

      /* Handle error codes */
      if (error.code == 'too-many-requests') {
        if (mounted) {
          showAuthPopup(
            context,
            'Password reset failed',
            'Too many recent password resets. Please try again later.',
          );
        }
      } else if (error.code == 'operation-not-allowed') {
        if (mounted) {
          showAuthPopup(
            context,
            'Password reset failed',
            'Password reset is currently disabled',
          );
        }
      } else if (error.code == 'invalid-email' ||
          error.code == 'missing-email') {
        if (mounted) {
          showAuthPopup(
            context,
            'Invalid email',
            'Please enter a valid email address',
          );
        }
      } else {
        if (mounted) {
          showAuthPopup(
              context, 'Unknown error occurred', 'Please try again later.');
        }
      }
    } catch (error) {
      if (mounted) {
        showAuthPopup(
          context,
          'Server error occurred',
          'Please try again later.',
        );
      }
    }
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
