import 'package:betiz/app/app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows the BETIZ splash and then navigates to home', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: BetizApp()));

    expect(find.text('BETIZ'), findsOneWidget);

    await tester.pumpAndSettle(const Duration(milliseconds: 1600));

    expect(find.text('Accueil BETIZ'), findsWidgets);
    expect(find.text('BETIZ'), findsNothing);
  });
}
