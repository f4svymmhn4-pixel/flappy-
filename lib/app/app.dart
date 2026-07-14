import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'router/app_router.dart';
import 'theme/app_theme.dart';

/// Root widget. Wires the [GoRouter] from [appRouterProvider] into a
/// [MaterialApp.router] and applies the light/dark [AppTheme].
class BetizApp extends ConsumerWidget {
  const BetizApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final GoRouter router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'BETIZ',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: router,
    );
  }
}
