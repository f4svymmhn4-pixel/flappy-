import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../game/domain/entities/difficulty.dart';
import '../controllers/play_setup_controller.dart';

class DifficultySelectScreen extends ConsumerWidget {
  const DifficultySelectScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Choisis la difficulté')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (final difficulty in Difficulty.values) ...[
              _DifficultyCard(
                difficulty: difficulty,
                onTap: () {
                  ref.read(playSetupControllerProvider.notifier).selectDifficulty(difficulty);
                  context.push(RoutePaths.animalSelect);
                },
              ),
              const SizedBox(height: AppSpacing.md),
            ],
          ],
        ),
      ),
    );
  }
}

class _DifficultyCard extends StatelessWidget {
  const _DifficultyCard({required this.difficulty, required this.onTap});

  final Difficulty difficulty;
  final VoidCallback onTap;

  Color _color() {
    return switch (difficulty) {
      Difficulty.easy => AppColors.success,
      Difficulty.medium => AppColors.secondary,
      Difficulty.hard => AppColors.error,
    };
  }

  @override
  Widget build(BuildContext context) {
    final Color color = _color();
    return Material(
      color: color.withValues(alpha: 0.12),
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.xl,
          ),
          child: Row(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: AppSpacing.md),
              Text(difficulty.label, style: AppTextStyles.title),
              const Spacer(),
              Icon(Icons.chevron_right_rounded, color: color),
            ],
          ),
        ),
      ),
    );
  }
}
