import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../core/error/failure.dart';
import '../../../profile/domain/entities/profile.dart';
import '../../../profile/presentation/controllers/profile_controller.dart';

/// Anonymous sign-in (if needed) + profile fetch happen as soon as
/// [profileControllerProvider] is first watched below; once it resolves,
/// this screen routes to onboarding or straight to home depending on
/// whether a pseudo has already been claimed.
class SplashScreen extends ConsumerWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<AsyncValue<Profile>>(profileControllerProvider, (previous, next) {
      next.whenData((profile) {
        final String destination = profile.hasPseudo
            ? RoutePaths.home
            : RoutePaths.onboardingPseudo;
        context.go(destination);
      });
    });

    final AsyncValue<Profile> state = ref.watch(profileControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Center(
        child: state.hasError
            ? _SplashError(
                message: state.error is Failure
                    ? (state.error! as Failure).message
                    : 'Une erreur est survenue.',
                onRetry: () => ref.invalidate(profileControllerProvider),
              )
            : Text(
                'BETIZ',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                ),
              ).animate().fadeIn(duration: 500.ms).scale(
                begin: const Offset(0.85, 0.85),
                curve: Curves.easeOutBack,
              ),
      ),
    );
  }
}

class _SplashError extends StatelessWidget {
  const _SplashError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(message, style: const TextStyle(color: Colors.white), textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.md),
          ElevatedButton(onPressed: onRetry, child: const Text('Réessayer')),
        ],
      ),
    );
  }
}
