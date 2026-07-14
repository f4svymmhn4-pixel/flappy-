import 'package:flutter/material.dart';

import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';

enum AnswerTileState { idle, selected, correct, wrongSelected, fadedOut }

class AnswerTile extends StatelessWidget {
  const AnswerTile({
    required this.label,
    required this.baseColor,
    required this.state,
    required this.playerBadges,
    required this.onTap,
    super.key,
  });

  final String label;
  final Color baseColor;
  final AnswerTileState state;
  final List<Widget> playerBadges;
  final VoidCallback? onTap;

  Color _fillColor() {
    return switch (state) {
      AnswerTileState.idle => baseColor.withValues(alpha: 0.15),
      AnswerTileState.selected => baseColor.withValues(alpha: 0.35),
      AnswerTileState.correct => const Color(0xFF34C759).withValues(alpha: 0.35),
      AnswerTileState.wrongSelected => const Color(0xFFFF3B30).withValues(alpha: 0.35),
      AnswerTileState.fadedOut => Colors.grey.withValues(alpha: 0.1),
    };
  }

  Color _borderColor() {
    return switch (state) {
      AnswerTileState.idle => baseColor.withValues(alpha: 0.4),
      AnswerTileState.selected => baseColor,
      AnswerTileState.correct => const Color(0xFF34C759),
      AnswerTileState.wrongSelected => const Color(0xFFFF3B30),
      AnswerTileState.fadedOut => Colors.grey.withValues(alpha: 0.2),
    };
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: _fillColor(),
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: _borderColor(), width: 2),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  child: Center(
                    child: Text(
                      label,
                      style: AppTextStyles.answerLabel,
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
                if (playerBadges.isNotEmpty)
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: AppSpacing.xs,
                    children: playerBadges,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
