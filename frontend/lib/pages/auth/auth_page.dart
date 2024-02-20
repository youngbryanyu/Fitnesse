/* Auth page that checks whether or not the user is signed in or not. 
This will determine if we show the user the login page or home page */
import "package:firebase_auth/firebase_auth.dart";
import "package:flutter/material.dart";
import "package:frontend/pages/auth/login_page.dart";
import "package:frontend/pages/home/home_page.dart";

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          /* User is logged in go to home page, else go to login page */
          if (snapshot.hasData) {
            return const HomePage();
          } else {
            return LoginPage();
          }
        },
      ),
    );
  }
}
