import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

/* Auth service for 3P sign ins */
class AuthService {
  final BuildContext context;

  AuthService(this.context);

  Future<void> signInWithGoogle() async {
    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible:
          false, // Prevents the dialog from closing until explicitly dismissed
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    try {
      // Begin interactive sign in process
      final GoogleSignInAccount? gUser = await GoogleSignIn().signIn();

      if (gUser == null) {
        if (context.mounted) {
          Navigator.pop(context); // Dismiss the loading dialog if cancelled
        }
        return;
      }

      // Obtain auth details from request
      final GoogleSignInAuthentication gAuth = await gUser.authentication;

      // Create new credential for user
      final credential = GoogleAuthProvider.credential(
        accessToken: gAuth.accessToken,
        idToken: gAuth.idToken,
      );

      // Sign in with credential
      await FirebaseAuth.instance.signInWithCredential(credential);
    } catch (error) {
      /* Do nothing on error */
    }

    // Dismiss the loading dialog
    if (context.mounted) {
      Navigator.pop(context);
    }
  }
}
