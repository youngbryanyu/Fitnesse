/* User profile setup wrapper page that handles which page to show in the profile onboarding workflow */
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/features/home/pages/home_page_selector.dart";
import "package:frontend/features/onboarding/pages/onboarding_page_selector.dart";
import "package:frontend/features/syncing/pages/syncing_page.dart";
import "package:frontend/features/syncing/providers/syncing_page_state_provider.dart";

// -------------------------------------------------------------
// - PUSH THIS PAGE ONTO NAVIGATION INSTEAD OF INDIVIDUAL SYNCING
// -------------------------------------------------------------

/* Wrapper class that determines which syncing page to show, and whether user is logged in */
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
      case SyncingPageState.onboarding:
        return const OnboardingPageSelector();
      case SyncingPageState.home:
        return const HomePageSelector();
      default:
        return const SyncingPage();
    }
  }
}
