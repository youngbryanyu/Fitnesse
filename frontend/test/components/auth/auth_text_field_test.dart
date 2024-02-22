import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/components/auth/auth_text_field.dart';

void main() {
  // A group of tests for AuthTextField
  group('AuthTextField Tests', () {
    // Test to ensure the widget displays the correct hint text
    testWidgets('Displays correct hint text', (WidgetTester tester) async {
      const testHintText = 'Enter your email';

      // Build our app and trigger a frame.
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthTextField(
            controller: TextEditingController(),
            hintText: testHintText,
            obscureText: false,
          ),
        ),
      ));

      // Verify that our text field displays the correct hint text.
      expect(find.text(testHintText), findsOneWidget);
    });

    // Test to ensure the text is obscured when obscureText is true
    testWidgets('Obscures text when obscureText is true',
        (WidgetTester tester) async {
      // Build our app and trigger a frame.
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthTextField(
            controller: TextEditingController(),
            hintText: 'Password',
            obscureText: true,
          ),
        ),
      ));

      // Fetch the TextField widget
      TextField textField = tester.widget(find.byType(TextField));
      // Verify that obscureText is true
      expect(textField.obscureText, true);
    });

    // Test to ensure onTap callback is called when suffix icon is tapped
    testWidgets('onTap callback is triggered on suffix icon tap',
        (WidgetTester tester) async {
      bool iconTapped = false;

      // Build our app and trigger a frame.
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthTextField(
            controller: TextEditingController(),
            hintText: 'Tap Icon',
            obscureText: false,
            suffixIcon: const Icon(Icons.visibility),
            onTap: () {
              iconTapped = true;
            },
          ),
        ),
      ));

      // Tap the suffix icon
      await tester.tap(find.byType(Icon));
      await tester.pump();

      // Verify that the onTap callback was triggered
      expect(iconTapped, true);
    });
  });
}
