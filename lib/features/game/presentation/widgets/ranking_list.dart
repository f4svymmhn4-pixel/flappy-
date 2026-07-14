import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../domain/entities/game_player.dart';

/// Shown once a round is revealed: players ranked by their now-updated
/// score, each row staggering in — the "classement spectaculaire mais
/// élégante" moment between rounds. Rebuilt fresh (and so replayed) every
/// round because [RoundView] keys its whole subtree by round id.
class RankingList extends StatelessWidget {
  const RankingList({required this.players, super.key});

  final List<GamePlayer> players;

  @override
  Widget build(BuildContext context) {
    final List<GamePlayer> ranked = [...players]
      ..sort((a, b) {
        final int byScore = b.score.compareTo(a.score);
        return byScore != 0 ? byScore : b.correctAnswers.compareTo(a.correctAnswers);
      });

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int index = 0; index < ranked.length; index++)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child:
                _RankingRow(rank: index + 1, player: ranked[index])
                    .animate(delay: (80 * index).ms)
                    .fadeIn(duration: 300.ms)
                    .slideY(begin: 0.3, end: 0, curve: Curves.easeOutCubic),
          ),
      ],
    );
  }
}

class _RankingRow extends StatelessWidget {
  const _RankingRow({required this.rank, required this.player});

  final int rank;
  final GamePlayer player;

  Color _rankColor() {
    return switch (rank) {
      1 => const Color(0xFFFFD700),
      2 => const Color(0xFFC0C0C0),
      3 => const Color(0xFFCD7F32),
      _ => Colors.grey,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
      decoration: BoxDecoration(
        color: rank == 1
            ? AppColors.secondary.withValues(alpha: 0.12)
            : Colors.grey.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: _rankColor().withValues(alpha: 0.3),
            child: Text('$rank', style: AppTextStyles.bodyStrong),
          ),
          const SizedBox(width: AppSpacing.sm),
          Icon(player.isBot ? Icons.smart_toy_rounded : Icons.pets_rounded, size: 18),
          const Spacer(),
          Text('${player.score} pts', style: AppTextStyles.bodyStrong),
        ],
      ),
    );
  }
}
