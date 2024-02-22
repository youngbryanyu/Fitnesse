import 'package:flutter/material.dart';

/* Button for popups during auth */
class PopupDialog extends StatelessWidget {
  final String title;
  final String message;

  const PopupDialog({
    super.key,
    required this.title,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;

    return AlertDialog(
      title: Text(
        title,
        style: Theme.of(context).textTheme.displayLarge,
        textAlign: TextAlign.center,
      ),
      content: Text(
        message,
        style: Theme.of(context).textTheme.bodyLarge,
        textAlign: TextAlign.center,
      ),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(
          Radius.circular(10),
        ),
      ),
      actions: <Widget>[
        Center(
          child: GestureDetector(
            onTap: () {
              Navigator.of(context).pop();
            },
            child: Container(
              padding: EdgeInsets.all(screenHeight * .01),
              // margin: EdgeInsets.symmetric(horizontal: screenHeight * .03),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  "OK",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/* Function which shows an auth popup */
void showAuthPopup(final context, String title, String message) {
  showDialog(
    context: context,
    builder: (context) {
      return PopupDialog(title: title, message: message);
    },
  );
}
