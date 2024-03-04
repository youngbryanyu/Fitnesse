import 'package:flutter_riverpod/flutter_riverpod.dart';

/* States for which home page the user is on */
enum HomePageState { home }

/* Listen for state changes for which onboarding page the user is on */
final homePageStateProvider = StateProvider<HomePageState>((ref) {
  return HomePageState.home; /* Initial state is home */
});
