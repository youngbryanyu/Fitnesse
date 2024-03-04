import 'package:flutter_riverpod/flutter_riverpod.dart';

/* States for which auth page the user is on */
enum OnboardingPageState {
  welcome,
}

/* Listen for state changes for which onboarding page the user is on */
final onboardingPageStateProvider = StateProvider<OnboardingPageState>((ref) {
  return OnboardingPageState.welcome; /* Initial state is welcome */
});
