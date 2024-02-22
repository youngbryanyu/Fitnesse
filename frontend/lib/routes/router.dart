/* File containing navigation functions */
import 'package:flutter/material.dart';

/* Navigation Routes class */
class NavigationRoutes {
  /* Push a new page onto the stack */
  void push(context, String routeName, {Object? arguments}) {
    Navigator.pushNamed(context, routeName, arguments: arguments);
  }

  /* Push route and replace previous route */
  void pushReplacement(context, String routeName, {Object? arguments}) {
    Navigator.pushReplacementNamed(context, routeName, arguments: arguments);
  }

  /* Push route and remove until condition is true */
  void pushNamedAndRemoveUntil(context, String routeName, {Object? arguments}) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      routeName,
      (Route<dynamic> route) => false,
      arguments: arguments,
    );
  }

  /* Pop a page from the stack */
  void pop(context) {
    Navigator.pop(context);
  }
}
