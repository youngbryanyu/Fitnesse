/* User profile setup wrapper page that handles which page to show in the profile onboarding workflow */
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/features/home/pages/home_page.dart";
import "package:frontend/features/onboarding/pages/welcome_page.dart";
import "package:frontend/features/onboarding/providers/onboarding_page_state_provider.dart";
import "package:frontend/features/syncing/pages/syncing_page.dart";
import "package:frontend/features/syncing/providers/syncing_page_state_provider.dart";

// -------------------------------------------------------------
// - PUSH THIS PAGE INSTEAD OF INDIVIDUAL ONBOARDING PAGES
// -------------------------------------------------------------

/* Wrapper class that determines which profile setup page to show, and whether user is logged in */
class SyncingPageSelector extends ConsumerWidget {
  const SyncingPageSelector({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Listen to state providers */
    final pageState = ref.watch(syncingPageStateProvider);

    /* Determine which page to show */
    switch (pageState) {
      case SyncingPageState.syncing:
        return const SyncingPage();
      case SyncingPageState.home:
        return HomePage();
      default:
        return HomePage(); // TODO: change this to home page selector
    }
  }
}
