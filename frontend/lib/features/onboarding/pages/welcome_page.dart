import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/syncing/providers/syncing_page_state_provider.dart';

class WelcomePage extends ConsumerWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Get the screen height */
    double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Let's get you set up",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: screenHeight * .01),
                ElevatedButton(
                  // TODO: navigate to next page instead of home
                  onPressed: () {
                    ref.read(syncingPageStateProvider.notifier).state =
                        SyncingPageState.home;
                  },
                  child: const Text('Next'),
                  // TODO create button (use auth buttom)
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
