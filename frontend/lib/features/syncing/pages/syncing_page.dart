import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/syncing/providers/syncing_page_state_provider.dart';

class SyncingPage extends ConsumerWidget {
  const SyncingPage({super.key});

  /* Download necessary user data from server, then switch to home selector page */
  Future<void> syncDataWithServer(WidgetRef ref) async {
    try {
      // TODO: make api call
      await Future.delayed(Duration(seconds: 1));
    } catch (error) {
      /* Log out upon error */
    }

    /* Go to home page selector */
    print(ref.watch(syncingPageStateProvider));
    ref.read(syncingPageStateProvider.notifier).state = SyncingPageState.home;
    print('synced');
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
