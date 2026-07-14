import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../controllers/matchmaking_watcher.dart';
import '../controllers/play_execution_controller.dart';

class MatchmakingScreen extends ConsumerWidget {
  const MatchmakingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<String> userIdState = ref.watch(currentUserIdProvider);

    return Scaffold(
      body: SafeArea(
        child: userIdState.when(
          data: (userId) => _Searching(userId: userId),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
          ),
        ),
      ),
    );
  }
}

class _Searching extends ConsumerWidget {
  const _Searching({required this.userId});

  final String userId;

  Future<void> _cancel(BuildContext context, WidgetRef ref) async {
    await ref.read(playExecutionControllerProvider.notifier).cancelMatchmaking();
    if (context.mounted) context.pop();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen(matchmakingWatcherProvider(userId), (previous, next) {
      final String? gameId = next.value;
      if (gameId != null) {
        context.go(RoutePaths.game.replaceFirst(':gameId', gameId));
      }
    });

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: AppColors.primary),
          const SizedBox(height: AppSpacing.lg),
          const Text(
            'Recherche de joueurs...',
            style: AppTextStyles.title,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xs),
          const Text(
            'La partie démarre dès que 5 joueurs sont réunis.',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xl),
          OutlinedButton(onPressed: () => _cancel(context, ref), child: const Text('Annuler')),
        ],
      ),
    );
  }
}
