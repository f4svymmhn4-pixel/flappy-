import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';

/// First frame shown on cold start. Purely presentational for now; once
/// auth/onboarding state is wired up this becomes the router's redirect
/// target while that state resolves.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1400), _proceed);
  }

  void _proceed() {
    if (!mounted) return;
    context.go(RoutePaths.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Center(
        child: Text(
              'BETIZ',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
            )
            .animate()
            .fadeIn(duration: 500.ms)
            .scale(begin: const Offset(0.85, 0.85), curve: Curves.easeOutBack),
      ),
    );
  }
}
