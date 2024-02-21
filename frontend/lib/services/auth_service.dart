import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

/* Authentication service for 3P sign in */
class AuthService {
  /* Google sign in */
  signInWithGoogle() async {
    /* Begin interactive sign in process */
    final GoogleSignInAccount? gUser = await GoogleSignIn().signIn();

    if (gUser == null) {
      return;
    }

    /* Obtain auth details from request */
    final GoogleSignInAuthentication gAuth = await gUser.authentication;

    /* Create new credential for user */
    final credential = GoogleAuthProvider.credential(
      accessToken: gAuth.accessToken,
      idToken: gAuth.idToken,
    );

    /* Sign in with credential */
    return await FirebaseAuth.instance.signInWithCredential(credential);
  }
}
