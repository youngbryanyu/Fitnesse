/* Entry point into the frontend */
import 'package:flutter/material.dart';
import 'pages/auth/login_page.dart';

/* Starts the app */
void main() {
  runApp(const App());
}

/* Main app widget */
class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
      themeMode: ThemeMode.system,
      /* Use system theme for now */
      theme: lightTheme,
      darkTheme: darkTheme,
    );
  }
}

// TODO: allow users to switch themes later in settings

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
    hintStyle: TextStyle(color: Colors.grey.shade500),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade500),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade700),
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
    hintStyle: TextStyle(color: Colors.grey.shade500),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade500),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade300),
    ),
  ),
);
