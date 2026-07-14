import 'package:flutter/material.dart';

import '../../domain/entities/game_answer.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/round_question.dart';
import 'answer_grid.dart';

/// The alignment each answer tile's center sits at within the 2x2 grid,
/// used as the animation target for that tile's animals. Approximate by
/// construction (a symmetric 2x2 grid), not measured — good enough for a
/// badge that only needs to visibly land "in" its tile, not to the pixel.
const List<Alignment> _tileAlignments = [
  Alignment(-0.5, -0.62),
  Alignment(0.5, -0.62),
  Alignment(-0.5, 0.62),
  Alignment(0.5, 0.62),
];

/// Wraps [AnswerGrid] with an animated overlay of every player's animal:
/// they all start at the center and race to whichever tile they pick,
/// re-routing instantly if the player changes their mind — the
/// "l'animal repart immédiatement" behavior from the game design doc.
class AnimalArena extends StatelessWidget {
  const AnimalArena({
    required this.question,
    required this.mySelection,
    required this.isRevealed,
    required this.players,
    required this.onSelect,
    super.key,
  });

  final RoundQuestion question;
  final int? mySelection;
  final bool isRevealed;
  final List<(GamePlayer, GameAnswer?)> players;
  final ValueChanged<int> onSelect;

  Map<int, List<GamePlayer>> _groupByOption() {
    final Map<int, List<GamePlayer>> byOption = {};
    for (final (player, answer) in players) {
      final int? selected = answer?.selectedOption;
      if (selected == null) continue;
      byOption.putIfAbsent(selected, () => []).add(player);
    }
    return byOption;
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        AnswerGrid(
          question: question,
          mySelection: mySelection,
          isRevealed: isRevealed,
          playersByOption: _groupByOption(),
          onSelect: onSelect,
        ),
        for (final (player, answer) in players)
          _AnimatedAnimal(
            key: ValueKey(player.id),
            isBot: player.isBot,
            targetAlignment: answer?.selectedOption == null
                ? Alignment.center
                : _tileAlignments[answer!.selectedOption!],
          ),
      ],
    );
  }
}

class _AnimatedAnimal extends StatelessWidget {
  const _AnimatedAnimal({required this.isBot, required this.targetAlignment, super.key});

  final bool isBot;
  final Alignment targetAlignment;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: AnimatedAlign(
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeOutBack,
        alignment: targetAlignment,
        child: Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: (isBot ? Colors.blueGrey : Colors.green).withValues(alpha: 0.9),
            border: Border.all(color: Colors.white, width: 2),
            boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
          ),
          child: Icon(
            isBot ? Icons.smart_toy_rounded : Icons.pets_rounded,
            size: 16,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
