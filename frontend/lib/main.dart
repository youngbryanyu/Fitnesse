/* Entry point into the frontend */
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/auth/pages/auth_page_selector.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:frontend/common/styles/themes.dart';
import 'package:frontend/routes/route_generator.dart';

/* Determine which firebase config file to import depending on environment */
import 'firebase_options_dev.dart'
    if (dart.library.prod) 'firebase_options_prod.dart' as firebase_options;

/* Starts the app */
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  /* Initialize firebase app */
  await Firebase.initializeApp(
      options: firebase_options.DefaultFirebaseOptions.currentPlatform);

  /* Start app */
  runApp(const ProviderScope(child: App()));
}

/* Main app widget */
class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      onGenerateRoute: generateRoute,
      home: const AuthPageSelector(),
      themeMode: ThemeMode.system,
      /* Use system theme for now */
      theme: lightTheme,
      darkTheme: darkTheme,
    );
  }
}
