import 'package:flutter_riverpod/flutter_riverpod.dart';

/* States for which auth page the user is on */
enum AuthPageState {
  login,
  register,
  forgotPassword,
  home,
}

/* Listen for state changes for which auth page the user is on */
final authPageStateProvider = StateProvider<AuthPageState>((ref) {
  return AuthPageState.register; /* Initial state is register */
});
