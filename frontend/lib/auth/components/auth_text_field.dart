import 'package:flutter/material.dart';

/* Text field for authentication pages like login and register */
class AuthTextField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obscureText;
  final Widget? suffixIcon; // Optional icon widget
  final VoidCallback? onTap; // Optional icon tap callback

  const AuthTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obscureText,
    this.suffixIcon, // Receive the icon as a parameter
    this.onTap, // Receive the tap callback as a parameter
  });

  @override
  Widget build(BuildContext context) {
    // Get the screen height
    double screenHeight = MediaQuery.of(context).size.height;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: screenHeight * .03),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        style: Theme.of(context).textTheme.bodyLarge,
        decoration: InputDecoration(
            enabledBorder: OutlineInputBorder(
              borderSide: Theme.of(context)
                      .inputDecorationTheme
                      .enabledBorder
                      ?.borderSide ??
                  BorderSide(color: Theme.of(context).colorScheme.primary),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: Theme.of(context)
                      .inputDecorationTheme
                      .focusedBorder
                      ?.borderSide ??
                  BorderSide(color: Theme.of(context).colorScheme.primary),
            ),
            fillColor: Theme.of(context).inputDecorationTheme.fillColor,
            filled: true,
            hintText: hintText,
            hintStyle: Theme.of(context).inputDecorationTheme.hintStyle,
            suffixIcon: suffixIcon != null
                ? GestureDetector(onTap: onTap, child: suffixIcon)
                : null),
      ),
    );
  }
}
