/* The home page after being authenticated */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';

/* Home page widget */
class HomePage extends ConsumerWidget {
  HomePage({super.key});

  /* Get the current user if logged in */
  final user = FirebaseAuth.instance.currentUser!;

  /* Signs out a user */
  void signOutUser(WidgetRef ref) async {
    FirebaseAuth.instance.signOut();
    ref.read(authPageStateProvider.notifier).state = AuthPageState.login;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
              onPressed: () {
                signOutUser(ref);
              },
              icon: const Icon(Icons.logout))
        ],
      ),
      body: Center(
        child: Text(
          "LOGGED IN! for ${user.email!}",
          style: const TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
