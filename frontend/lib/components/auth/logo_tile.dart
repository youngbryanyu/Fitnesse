/* Logo tile for 3rd party logos like Google and Apple sign in logos */
import 'package:flutter/material.dart';

class LogoTile extends StatelessWidget {
  final String imagePath;

  const LogoTile({
    super.key,
    required this.imagePath,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          border: Border.all(color: Colors.white),
          borderRadius: BorderRadius.circular(16),
          color: Colors.grey[200]),
      child: Image.asset(imagePath, height: 40),
    );
  }
}
