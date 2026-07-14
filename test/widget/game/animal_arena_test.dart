import 'package:betiz/features/game/domain/entities/game_answer.dart';
import 'package:betiz/features/game/domain/entities/game_player.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/domain/entities/round_question.dart';
import 'package:betiz/features/game/presentation/widgets/animal_arena.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const RoundQuestion _question = RoundQuestion(
  roundId: 'round-1',
  roundNumber: 1,
  categoryId: 'category-1',
  prompt: 'Quel est le plus grand animal terrestre ?',
  options: ['Le rhinocéros', "L'éléphant d'Afrique", 'La girafe', "L'hippopotame"],
  correctOption: null,
);

GamePlayer _player(String id, {bool isBot = false}) => GamePlayer(
      id: id,
      gameId: 'game-1',
      userId: isBot ? null : 'user-$id',
      isBot: isBot,
      botDifficulty: null,
      animalId: 'animal-1',
      status: GamePlayerStatus.joined,
      score: 0,
      correctAnswers: 0,
    );

GameAnswer _answer(String gamePlayerId, {int? selectedOption}) => GameAnswer(
      id: 'answer-$gamePlayerId',
      roundId: 'round-1',
      gamePlayerId: gamePlayerId,
      selectedOption: selectedOption,
      isCorrect: null,
      answeredAt: null,
      responseTimeMs: null,
      pointsAwarded: 0,
      rankWhenCorrect: null,
    );

void main() {
  testWidgets('renders the 4 options and an animal per player without throwing', (tester) async {
    int? tapped;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            height: 400,
            child: AnimalArena(
              question: _question,
              mySelection: null,
              isRevealed: false,
              players: [(_player('gp-1'), null), (_player('gp-2', isBot: true), null)],
              onSelect: (index) => tapped = index,
            ),
          ),
        ),
      ),
    );

    for (final option in _question.options) {
      expect(find.text(option), findsOneWidget);
    }
    expect(find.byIcon(Icons.pets_rounded), findsWidgets);
    expect(find.byIcon(Icons.smart_toy_rounded), findsWidgets);

    await tester.tap(find.text('Le rhinocéros'));
    expect(tapped, 0);
  });

  testWidgets('an animal animates from center to its picked tile without error', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            height: 400,
            child: AnimalArena(
              question: _question,
              mySelection: 1,
              isRevealed: false,
              players: [(_player('gp-1'), _answer('gp-1', selectedOption: 1))],
              onSelect: (_) {},
            ),
          ),
        ),
      ),
    );

    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 450));

    expect(tester.takeException(), isNull);
  });

  testWidgets('tapping is disabled once revealed', (tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            height: 400,
            child: AnimalArena(
              question: _question.correctOptionOverride(1),
              mySelection: 0,
              isRevealed: true,
              players: const [],
              onSelect: (_) => tapped = true,
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text("L'éléphant d'Afrique"));
    expect(tapped, isFalse);
  });
}

extension on RoundQuestion {
  RoundQuestion correctOptionOverride(int value) {
    return RoundQuestion(
      roundId: roundId,
      roundNumber: roundNumber,
      categoryId: categoryId,
      prompt: prompt,
      options: options,
      correctOption: value,
    );
  }
}
