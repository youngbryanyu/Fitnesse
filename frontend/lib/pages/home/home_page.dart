import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomePage extends ConsumerWidget {
  HomePage({super.key});

  /* Get the current user if logged in */
  final user = FirebaseAuth.instance.currentUser!;

  /* */
  void signOutUser() async {
    FirebaseAuth.instance.signOut();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(onPressed: signOutUser, icon: const Icon(Icons.logout))
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
