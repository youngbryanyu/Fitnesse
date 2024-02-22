/* File containing navigation functions */
import 'package:flutter/material.dart';

/* Navigation Routes class */
abstract class RouteNavigator {
  /* Push a new page onto the stack */
  static void push(context, String routeName, {Object? arguments}) {
    Navigator.pushNamed(context, routeName, arguments: arguments);
  }

  /* Push route and replace previous route */
  static void pushReplacement(context, String routeName, {Object? arguments}) {
    Navigator.pushReplacementNamed(context, routeName, arguments: arguments);
  }

  /* Push route and remove until condition is true */
  static void pushNamedAndRemoveUntil(context, String routeName,
      {Object? arguments}) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      routeName,
      (Route<dynamic> route) => false,
      arguments: arguments,
    );
  }

  /* Pop a page from the stack */
  static void pop(context) {
    Navigator.pop(context);
  }
}
