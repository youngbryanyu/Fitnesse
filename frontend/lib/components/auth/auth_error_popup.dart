/* Error message popup during login and register */
/* Button for authentication pages like login and register */
import 'package:flutter/material.dart';

class AuthErrorPopup extends StatelessWidget {
  final String message;

  const AuthErrorPopup({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(
        message,
        style: Theme.of(context).textTheme.bodyLarge,
        textAlign: TextAlign.center,
      ),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(
          Radius.circular(10),
        ),
      ),
    );
  }
}
