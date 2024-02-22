/* Authentication wrapper page that handles which page to show in the auth workflow */
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/pages/auth/login_page.dart";
import "package:frontend/pages/auth/register_page.dart";
import "package:frontend/pages/home/home_page.dart";
import "package:frontend/providers/auth/auth_page_provider.dart";
import "package:frontend/providers/auth/firebase_auth_state_provider.dart";

// -----------------------------------------------------------
// THIS SHOULD ALWAYS BE THE PAGE AT THE ROOT OF THE NAVIGATOR
// -----------------------------------------------------------

/* Wrapper class that determines which auth page to show, and whether user is logged in */
class RootPageWrapper extends ConsumerWidget {
  const RootPageWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Listen to state providers */
    final authState = ref.watch(firebaseAuthStateProvider);
    final pageState = ref.watch(authPageStateProvider);

    /* Determine which page to show depending on states */
    return authState.when(
      data: (user) {
        if (user == null) {
          /* User is not logged in */
          switch (pageState) {
            case AuthPageState.login:
              return const LoginPage();
            case AuthPageState.register:
              return const RegisterPage();
            default:
              return const RegisterPage();
          }
        } else {
          /* User is logged in */
          return HomePage();
        }
      },
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => const Text('An error occurred'),
    );
  }
}
