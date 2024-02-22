import 'package:flutter/material.dart';

/* Logo tile for 3rd party logos like Google and Apple sign in logos */
class LogoTile extends StatelessWidget {
  final String imagePath;
  final Function()? onTap;

  const LogoTile({
    super.key,
    required this.imagePath,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Get the screen height
    double screenHeight = MediaQuery.of(context).size.height;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(screenHeight * .02),
        decoration: BoxDecoration(
          border: Border.all(
            color: Theme.of(context).colorScheme.onPrimary,
          ),
          borderRadius: BorderRadius.circular(16),
          color: Theme.of(context).colorScheme.primary,
        ),
        child: Image.asset(
          imagePath,
          height: screenHeight * .04,
        ),
      ),
    );
  }
}
