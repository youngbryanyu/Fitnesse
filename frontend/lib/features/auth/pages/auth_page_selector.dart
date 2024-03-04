/* Authentication wrapper page that handles which page to show in the auth workflow */
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/features/auth/pages/login_page.dart";
import "package:frontend/features/auth/pages/register_page.dart";
import "package:frontend/features/auth/pages/forgot_password_page.dart";
import "package:frontend/features/auth/providers/auth_page_state_provider.dart";
import "package:frontend/features/auth/providers/firebase_auth_state_provider.dart";
import "package:frontend/features/syncing/pages/syncing_page_selector.dart";

// -------------------------------------------------------------
// - THIS SHOULD ALWAYS BE THE PAGE AT THE ROOT OF THE NAVIGATOR
// - PUSH THIS PAGE INSTEAD OF INDIVIDUAL AUTH PAGES
// -------------------------------------------------------------

/* Wrapper class that determines which auth page to show, and whether user is logged in */
class AuthPageSelector extends ConsumerWidget {
  const AuthPageSelector({super.key});

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
            case AuthPageState.forgotPassword:
              return const ResetPasswordPage();
            default:
              return const RegisterPage();
          }
        } else {
          /* User is logged in */
          return const SyncingPageSelector();
          // return HomePage();
        }
      },
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => const Text('An error occurred'),
    );
  }
}
