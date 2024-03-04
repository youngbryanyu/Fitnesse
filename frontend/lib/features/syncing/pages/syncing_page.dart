import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/services/api/user_api_service.dart';
import 'package:frontend/features/syncing/providers/syncing_page_state_provider.dart';

class SyncingPage extends ConsumerWidget {
  const SyncingPage({super.key});

  /* Download necessary user data from server, then switch to home selector page */
  Future<void> syncDataWithServer(WidgetRef ref) async {
    try {
      final userId = FirebaseAuth.instance.currentUser?.uid;

      if (userId == null) {
        throw Error();
      }

      final user = await UserApiService.getUser(userId);
      print(user);
      // TODO: write user to local realm DB

      /* Go to home page */
      ref.read(syncingPageStateProvider.notifier).state = SyncingPageState.home;
      // TODO: go to home page selector instead of home page
    } catch (error) {
      /* Log out upon error */
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Call data sync function user*/
    WidgetsBinding.instance.addPostFrameCallback((_) {
      syncDataWithServer(ref);
    });

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(
                  height: 20), // Spacing between the indicator and text
              Text(
                'Syncing data with the server...',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onBackground,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
