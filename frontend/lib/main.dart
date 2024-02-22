/* Entry point into the frontend */
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/pages/core/root_page_wrapper.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:frontend/routes/routes_handler.dart';

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
      home: const RootPageWrapper(),
      themeMode: ThemeMode.system,
      /* Use system theme for now */
      theme: lightTheme,
      darkTheme: darkTheme,
    );
  }
}

/* Light theme */
final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  useMaterial3: true, // Opt-in to using Material 3 features
  colorScheme: ColorScheme.light(
    primary: Colors.grey.shade900,
    onPrimary: Colors.white,
    secondary: Colors.grey.shade700,
    onSecondary: Colors.grey.shade200,
    background: Colors.grey.shade100,
    onBackground: Colors.black,
    surface: Colors.grey.shade500,
    onSurface: Colors.black,
    error: Colors.red[700]!,
    onError: Colors.white,
  ),
  inputDecorationTheme: InputDecorationTheme(
    fillColor: Colors.grey.shade300,
    hintStyle: TextStyle(
      color: Colors.grey.shade500,
      fontSize: 16,
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.grey.shade500,
      ),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.grey.shade700,
      ),
    ),
  ),
  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
    displayMedium: TextStyle(
      fontSize: 22,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
    displaySmall: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
    bodyLarge: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.normal,
      color: Colors.black,
    ),
    bodyMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.normal,
      color: Colors.black,
    ),
    bodySmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: Colors.black,
    ),
    labelLarge: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
    labelMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
    labelSmall: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
  ),
);

/* Dark theme */
final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  useMaterial3: true,
  colorScheme: ColorScheme.dark(
    primary: Colors.grey.shade100,
    onPrimary: Colors.black,
    secondary: Colors.grey.shade300,
    onSecondary: Colors.grey.shade800,
    background: Colors.grey.shade900,
    onBackground: Colors.white,
    surface: Colors.grey.shade500,
    onSurface: Colors.black,
    error: Colors.red[900]!,
    onError: Colors.white,
  ),
  inputDecorationTheme: InputDecorationTheme(
    fillColor: Colors.grey.shade700,
    hintStyle: TextStyle(
      color: Colors.grey.shade500,
      fontSize: 16,
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.grey.shade500,
      ),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.grey.shade300,
      ),
    ),
  ),
  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
    displayMedium: TextStyle(
      fontSize: 22,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
    displaySmall: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
    bodyLarge: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.normal,
      color: Colors.white,
    ),
    bodyMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.normal,
      color: Colors.white,
    ),
    bodySmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: Colors.white,
    ),
    labelLarge: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
    labelMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
    labelSmall: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.black,
    ),
  ),
);
