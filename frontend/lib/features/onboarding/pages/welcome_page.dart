import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/components/buttons/small_round_button.dart';
import 'package:frontend/features/onboarding/providers/onboarding_page_state_provider.dart';

/* Welcome page shown before user onboards */
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
                /* Title text */
                Text(
                  "Let's get you set up",
                  style: Theme.of(context).textTheme.displayLarge,
                ),
                SizedBox(height: screenHeight * .01),
                Text(
                  "Looks like you haven't set up your profile yet",
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                SizedBox(height: screenHeight * .01),

                /* Next page button */
                SmallRoundButton(
                  title: "Next",
                  onPressed: () {
                    ref.read(onboardingPageStateProvider.notifier).state =
                        OnboardingPageState.enterBiometrics;
                  },
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
