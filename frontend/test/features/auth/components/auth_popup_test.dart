import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/common/components/popup_dialog.dart';

void main() {
  // Widget test group for AuthPopup
  group('AuthPopup Widget Tests', () {
    // Test to ensure the popup displays the correct title and message
    testWidgets('Displays the correct title and message',
        (WidgetTester tester) async {
      const testTitle = 'Test Title';
      const testMessage = 'Test message content';

      // Create a MaterialApp to ensure Theme and other context dependencies are available
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) {
              return ElevatedButton(
                onPressed: () => showAuthPopup(context, testTitle, testMessage),
                child: const Text('Show Popup'),
              );
            },
          ),
        ),
      ));

      // Tap the button to show the popup
      await tester.tap(find.text('Show Popup'));
      await tester.pump(); // Rebuild the widget with the popup

      // Verify the title and message are displayed correctly
      expect(find.text(testTitle), findsOneWidget);
      expect(find.text(testMessage), findsOneWidget);
    });

    // Test to ensure tapping the "OK" button dismisses the popup
    testWidgets('Dismisses the popup on tapping "OK"',
        (WidgetTester tester) async {
      const testTitle = 'Dismiss Test';
      const testMessage = 'Tap OK to dismiss';

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) {
              return ElevatedButton(
                onPressed: () => showAuthPopup(context, testTitle, testMessage),
                child: const Text('Show Popup'),
              );
            },
          ),
        ),
      ));

      // Show the popup
      await tester.tap(find.text('Show Popup'));
      await tester.pump(); // Rebuild the widget with the popup

      // Tap the "OK" button to attempt to dismiss the popup
      await tester.tap(find.text('OK'));
      await tester.pump(); // Rebuild the widget after the popup is dismissed

      // Verify that the popup has been dismissed by checking that its title is no longer displayed
      expect(find.text(testTitle), findsNothing);
    });
  });
}
