import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/round_question.dart';
import 'answer_tile.dart';
import 'player_badge.dart';

const List<Color> _tileColors = [
  AppColors.answerRed,
  AppColors.answerBlue,
  AppColors.answerYellow,
  AppColors.answerGreen,
];

class AnswerGrid extends StatelessWidget {
  const AnswerGrid({
    required this.question,
    required this.mySelection,
    required this.isRevealed,
    required this.playersByOption,
    required this.onSelect,
    super.key,
  });

  final RoundQuestion question;
  final int? mySelection;
  final bool isRevealed;

  /// Index 0-3 -> the players currently occupying that tile.
  final Map<int, List<GamePlayer>> playersByOption;
  final ValueChanged<int> onSelect;

  AnswerTileState _stateFor(int index) {
    if (!isRevealed) {
      return index == mySelection ? AnswerTileState.selected : AnswerTileState.idle;
    }
    if (index == question.correctOption) return AnswerTileState.correct;
    if (index == mySelection) return AnswerTileState.wrongSelected;
    return AnswerTileState.fadedOut;
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      mainAxisSpacing: AppSpacing.md,
      crossAxisSpacing: AppSpacing.md,
      childAspectRatio: 1.4,
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      children: [
        for (int index = 0; index < 4; index++)
          AnswerTile(
            label: question.options[index],
            baseColor: _tileColors[index],
            state: _stateFor(index),
            playerBadges: [
              for (final player in playersByOption[index] ?? const <GamePlayer>[])
                PlayerBadge(key: ValueKey(player.id), isBot: player.isBot),
            ],
            onTap: isRevealed ? null : () => onSelect(index),
          ),
      ],
    );
  }
}
