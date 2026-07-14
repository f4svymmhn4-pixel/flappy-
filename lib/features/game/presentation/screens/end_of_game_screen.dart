import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../domain/entities/game_player.dart';
import '../controllers/game_realtime_controller.dart';
import '../controllers/gameplay_controller.dart';

class EndOfGameScreen extends ConsumerWidget {
  const EndOfGameScreen({required this.gameId, super.key});

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<List<GamePlayer>> playersState = ref.watch(gamePlayersStreamProvider(gameId));
    final AsyncValue<int?> tokensState = ref.watch(myGameTokenRewardProvider(gameId));

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: playersState.when(
        data: (players) {
          final List<GamePlayer> ranked = [...players]
            ..sort((a, b) {
              final int byScore = b.score.compareTo(a.score);
              return byScore != 0 ? byScore : b.correctAnswers.compareTo(a.correctAnswers);
            });
          final List<GamePlayer> top5 = ranked.take(5).toList();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: AppSpacing.lg),
              const Text(
                'Partie terminée !',
                style: AppTextStyles.displayLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.xs),
              tokensState.maybeWhen(
                data: (tokens) => tokens == null
                    ? const SizedBox.shrink()
                    : Text(
                        '+$tokens jetons',
                        style: AppTextStyles.bodyStrong.copyWith(color: AppColors.secondary),
                        textAlign: TextAlign.center,
                      ),
                orElse: () => const SizedBox.shrink(),
              ),
              const SizedBox(height: AppSpacing.xl),
              Expanded(
                child: ListView.separated(
                  itemCount: top5.length,
                  separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, index) => _RankRow(rank: index + 1, player: top5[index]),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              ElevatedButton(
                onPressed: () => context.go(RoutePaths.playMode),
                child: const Text('Rejouer'),
              ),
              const SizedBox(height: AppSpacing.sm),
              OutlinedButton(
                onPressed: () => context.go(RoutePaths.home),
                child: const Text('Retour à l\'accueil'),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
        ),
      ),
    );
  }
}

class _RankRow extends StatelessWidget {
  const _RankRow({required this.rank, required this.player});

  final int rank;
  final GamePlayer player;

  Color _medalColor() {
    return switch (rank) {
      1 => const Color(0xFFFFD700),
      2 => const Color(0xFFC0C0C0),
      3 => const Color(0xFFCD7F32),
      _ => Colors.grey,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _medalColor().withValues(alpha: 0.25),
          child: Text('$rank', style: AppTextStyles.bodyStrong),
        ),
        title: Row(
          children: [
            const Icon(Icons.pets_rounded, size: 18),
            const SizedBox(width: AppSpacing.xs),
            Text(player.isBot ? 'Bot' : 'Joueur', style: AppTextStyles.bodyStrong),
          ],
        ),
        subtitle: Text('${player.correctAnswers} bonnes réponses'),
        trailing: Text('${player.score} pts', style: AppTextStyles.headline),
      ),
    );
  }
}
