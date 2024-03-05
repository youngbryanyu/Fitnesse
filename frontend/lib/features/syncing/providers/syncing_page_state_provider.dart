import 'package:flutter_riverpod/flutter_riverpod.dart';

/* States for which syncing page the user is on */
enum SyncingPageState {
  syncing,
  onboarding,
  home,
}

/* Listen for state changes for which onboarding page the user is on */
final syncingPageStateProvider = StateProvider<SyncingPageState>((ref) {
  return SyncingPageState.syncing; /* Initial state is welcome */
});
