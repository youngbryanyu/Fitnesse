import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/components/buttons/small_round_button.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';

class EnterBiometricsPage extends ConsumerWidget {
  const EnterBiometricsPage({super.key});

  void signOutUser(WidgetRef ref) async {
    FirebaseAuth.instance.signOut();
    ref.read(authPageStateProvider.notifier).state = AuthPageState.login;

    // TODO: notify user if not all data has been synced with server yet

    // TODO: move this to a central shared file
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    /* Get the screen height */
    double screenHeight = MediaQuery.of(context).size.height;
    // Controllers for form fields
    final TextEditingController birthdayController = TextEditingController();
    // Add controllers for other fields as needed

    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.background,
          title: Text(
            "Profile Setup",
            style: Theme.of(context).textTheme.displaySmall,
          )),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Birthday",
                style: TextStyle(fontSize: 16),
              ),
              TextField(
                controller: birthdayController,
                decoration: const InputDecoration(
                  hintText: 'YYYY-MM-DD',
                ),
              ),
              // Add other fields (sex, height, weight, etc.) here
              SizedBox(height: screenHeight * .01),

              /* Save button */
              Align(
                alignment: Alignment.centerRight,
                child: SmallRoundButton(
                  title: "Save",
                  onPressed: () {
                    signOutUser(ref);
                  },
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
