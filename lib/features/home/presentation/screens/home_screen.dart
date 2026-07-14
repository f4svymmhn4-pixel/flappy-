import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../../game/presentation/controllers/game_lifecycle_controller.dart';
import '../../../profile/domain/entities/profile.dart';
import '../../../profile/presentation/controllers/profile_controller.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<Profile> profileState = ref.watch(profileControllerProvider);

    return Scaffold(
      body: SafeArea(
        child: profileState.when(
          data: (profile) => _HomeContent(profile: profile),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => _HomeError(
            message: error is Failure ? error.message : 'Une erreur est survenue.',
            onRetry: () => ref.invalidate(profileControllerProvider),
          ),
        ),
      ),
    );
  }
}

class _HomeContent extends ConsumerWidget {
  const _HomeContent({required this.profile});

  final Profile profile;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<String?> resumableGame = ref.watch(resumableGameProvider);

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  profile.pseudo ?? '',
                  style: AppTextStyles.headline,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              _TokenBadge(tokens: profile.tokens),
              const SizedBox(width: AppSpacing.sm),
              IconButton(
                icon: const Icon(Icons.person_outline_rounded),
                onPressed: () => context.push(RoutePaths.profile),
              ),
            ],
          ),
          resumableGame.maybeWhen(
            data: (gameId) => gameId == null
                ? const SizedBox.shrink()
                : _ResumeGameBanner(gameId: gameId),
            orElse: () => const SizedBox.shrink(),
          ),
          const Spacer(),
          const Text('BETIZ', style: AppTextStyles.displayLarge, textAlign: TextAlign.center),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Niveau ${profile.level} · ${profile.gamesWon} victoires',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () => context.push(RoutePaths.playMode),
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: AppSpacing.xs),
              child: Text('Jouer'),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          OutlinedButton(
            onPressed: () => context.push(RoutePaths.shop),
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: AppSpacing.xs),
              child: Text('Boutique'),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
        ],
      ),
    );
  }
}

class _ResumeGameBanner extends StatelessWidget {
  const _ResumeGameBanner({required this.gameId});

  final String gameId;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.md),
      child: Material(
        color: AppColors.secondary.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppRadius.md),
          onTap: () => context.go(RoutePaths.game.replaceFirst(':gameId', gameId)),
          child: const Padding(
            padding: EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                Icon(Icons.replay_circle_filled_rounded, color: AppColors.secondary),
                SizedBox(width: AppSpacing.sm),
                Expanded(child: Text('Reprendre la partie en cours', style: AppTextStyles.bodyStrong)),
                Icon(Icons.chevron_right_rounded),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TokenBadge extends StatelessWidget {
  const _TokenBadge({required this.tokens});

  final int tokens;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
        color: AppColors.secondary.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.circle, size: 10, color: AppColors.secondary),
          const SizedBox(width: AppSpacing.xs),
          Text('$tokens', style: AppTextStyles.bodyStrong),
        ],
      ),
    );
  }
}

class _HomeError extends StatelessWidget {
  const _HomeError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message, style: AppTextStyles.body, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.md),
            ElevatedButton(onPressed: onRetry, child: const Text('Réessayer')),
          ],
        ),
      ),
    );
  }
}
