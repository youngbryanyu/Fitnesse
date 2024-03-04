import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/features/auth/components/auth_logo_tile.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('LogoTile Tests', () {
    testWidgets('Displays an image from the provided imagePath',
        (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthLogoTile(
            imagePath: 'test/assets/images/google-logo.png',
            onTap: () {},
          ),
        ),
      ));

      expect(find.byType(Image), findsOneWidget);
    });

    testWidgets('Responds to tap events', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: AuthLogoTile(
            imagePath: 'test/assets/images/google-logo.png',
            onTap: () {
              tapped = true;
            },
          ),
        ),
      ));

      await tester.tap(find.byType(AuthLogoTile));
      await tester.pump();

      expect(tapped, true);
    });
  });
}
