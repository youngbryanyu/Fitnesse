/* State providers for riverpod state management */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/* States for which auth page the user is on */
enum AuthPageState {
  login,
  register,
  home,
}

/* Listen for state changes for which auth page the user is on */
final authPageStateProvider = StateProvider<AuthPageState>((ref) {
  return AuthPageState.register;
});

/* Listen for state changes in firebase for whether user logged in or out */
final firebaseAuthStateProvider = StreamProvider<User?>((ref) {
  return FirebaseAuth.instance.authStateChanges();
});
