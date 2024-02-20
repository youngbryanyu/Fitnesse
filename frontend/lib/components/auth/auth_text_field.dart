/* Text field for authentication pages like login and register */
import 'package:flutter/material.dart';

class AuthTextField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obscureText;

  const AuthTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obscureText,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
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
        ),
      ),
    );
  }
}
