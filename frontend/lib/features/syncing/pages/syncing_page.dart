import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/services/api/user_api_service.dart';
import 'package:frontend/common/services/realm/user_realm_service.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';
import 'package:frontend/features/syncing/providers/syncing_page_state_provider.dart';
import 'package:frontend/logging/logger.dart';

/* Loading page to show while data is syncing with the cloud */
class SyncingPage extends ConsumerWidget {
  const SyncingPage({super.key});

  /* Signs out a user */
  void signOutUser(WidgetRef ref) async {
    FirebaseAuth.instance.signOut();
    ref.read(authPageStateProvider.notifier).state = AuthPageState.login;
  }

  /* Download necessary user data from server, then switch to home selector page */
  Future<void> syncDataWithServer(WidgetRef ref) async {
    try {
      final userId = FirebaseAuth.instance.currentUser?.uid;
      if (userId == null) {
        throw Error();
      }

      /* Make HTTP request to get user info */
      final userData = await UserApiService.getUser(userId);
      if (userData == null) {
        throw Error();
      }

      /* Go to onboarding if no user info yet */
      ref.read(syncingPageStateProvider.notifier).state =
          SyncingPageState.onboarding;
      appLogger.info('done');
      /* Save user to realm */
      await UserRealmService.createUser(userData);

      /* Go to home page */
      ref.read(syncingPageStateProvider.notifier).state = SyncingPageState.home;
    } catch (error) {
      appLogger.info('Error occurred while syncing data with server:\n', error);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Get the screen height */
    double screenHeight = MediaQuery.of(context).size.height;

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
              SizedBox(height: screenHeight * .1),
              Text(
                'Syncing data with the server...',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onBackground,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: screenHeight * .01),
              GestureDetector(
                onTap: () {
                  signOutUser(ref);
                },
                child: Text(
                  'Cancel',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onBackground,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
