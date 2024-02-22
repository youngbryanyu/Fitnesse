import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/auth/components/auth_button.dart';

void main() {
  // A group of tests for AuthButton
  group('AuthButton Tests', () {
    // Test to ensure the widget builds with the correct message
    testWidgets('Displays the correct message', (WidgetTester tester) async {
      const testMessage = 'Test Button';

      // Build our app and trigger a frame.
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthButton(
            onTap: () {},
            message: testMessage,
          ),
        ),
      ));

      // Verify that our button displays the correct message.
      expect(find.text(testMessage), findsOneWidget);
    });

    // Test to ensure the onTap callback is called
    testWidgets('onTap callback is triggered on tap',
        (WidgetTester tester) async {
      bool tapped = false;

      // Build our app and trigger a frame with onTap callback updating `tapped` to true
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthButton(
            onTap: () {
              tapped = true;
            },
            message: 'Tap Me',
          ),
        ),
      ));

      // Tap on the widget that finds the text 'Tap Me'
      await tester.tap(find.text('Tap Me'));
      await tester.pump(); // Rebuild the widget after the state change.

      // Verify that our button's onTap callback was triggered.
      expect(tapped, true);
    });
  });
}
