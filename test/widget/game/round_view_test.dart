import 'package:betiz/core/error/result.dart';
import 'package:betiz/features/game/domain/entities/difficulty.dart';
import 'package:betiz/features/game/domain/entities/game.dart';
import 'package:betiz/features/game/domain/entities/game_answer.dart';
import 'package:betiz/features/game/domain/entities/game_player.dart';
import 'package:betiz/features/game/domain/entities/game_round.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/domain/entities/round_question.dart';
import 'package:betiz/features/game/domain/repositories/gameplay_repository.dart';
import 'package:betiz/features/game/presentation/controllers/game_realtime_controller.dart';
import 'package:betiz/features/game/presentation/controllers/gameplay_controller.dart';
import 'package:betiz/features/game/presentation/screens/round_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockGameplayRepository extends Mock implements GameplayRepository {}

const Game _game = Game(
  id: 'game-1',
  visibility: GameVisibility.public,
  roomCode: null,
  difficulty: Difficulty.easy,
  status: GameStatus.inProgress,
  maxPlayers: 5,
  minPlayers: 2,
  isSolo: false,
  currentRound: 1,
  totalRounds: 5,
  roundDurationSeconds: 10,
  hostId: 'user-1',
);

const RoundQuestion _question = RoundQuestion(
  roundId: 'round-1',
  roundNumber: 1,
  categoryId: 'category-1',
  prompt: 'Quel est le plus grand animal terrestre ?',
  options: ['Le rhinocéros', "L'éléphant d'Afrique", 'La girafe', "L'hippopotame"],
  correctOption: null,
);

void main() {
  testWidgets(
    'a round whose timer has already run out triggers reveal_round exactly once',
    (tester) async {
      final repository = MockGameplayRepository();
      when(() => repository.getRoundQuestion('round-1')).thenAnswer(
        (_) async => const Result.success(_question),
      );
      when(() => repository.revealRound('round-1')).thenAnswer(
        (_) async => const Result.success(null),
      );

      final GameRound expiredRound = GameRound(
        id: 'round-1',
        gameId: 'game-1',
        roundNumber: 1,
        questionId: 'question-1',
        status: RoundStatus.active,
        startedAt: DateTime.now().subtract(const Duration(seconds: 11)),
        endsAt: DateTime.now().subtract(const Duration(seconds: 1)),
        revealedAt: null,
      );

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            gameplayRepositoryProvider.overrideWithValue(repository),
            gameStreamProvider('game-1').overrideWith((ref) => Stream.value(_game)),
            gameRoundsStreamProvider(
              'game-1',
            ).overrideWith((ref) => Stream.value([expiredRound])),
            gamePlayersStreamProvider(
              'game-1',
            ).overrideWith((ref) => Stream.value(const <GamePlayer>[])),
            roundAnswersStreamProvider(
              'round-1',
            ).overrideWith((ref) => Stream.value(const <GameAnswer>[])),
          ],
          child: MaterialApp(
            home: Scaffold(
              body: RoundView(gameId: 'game-1', round: expiredRound, roundDurationSeconds: 10),
            ),
          ),
        ),
      );

      // Let the initial stream emissions settle, then advance the 200ms
      // ticker at least once.
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 250));

      verify(() => repository.revealRound('round-1')).called(1);

      // Flush the pending .then() continuation, then unmount RoundView so
      // its periodic ticker is actually cancelled — otherwise the test
      // framework's end-of-test invariant check fails with "a Timer is
      // still pending".
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pumpWidget(const SizedBox.shrink());
    },
  );

  testWidgets('tapping an answer while active calls submitAnswer', (tester) async {
    final repository = MockGameplayRepository();
    when(() => repository.getRoundQuestion('round-1')).thenAnswer(
      (_) async => const Result.success(_question),
    );
    when(
      () => repository.submitAnswer(roundId: 'round-1', selectedOption: 2),
    ).thenAnswer((_) async => const Result.success(null));

    final GameRound activeRound = GameRound(
      id: 'round-1',
      gameId: 'game-1',
      roundNumber: 1,
      questionId: 'question-1',
      status: RoundStatus.active,
      startedAt: DateTime.now(),
      endsAt: DateTime.now().add(const Duration(seconds: 10)),
      revealedAt: null,
    );

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          gameplayRepositoryProvider.overrideWithValue(repository),
          gameStreamProvider('game-1').overrideWith((ref) => Stream.value(_game)),
          gameRoundsStreamProvider('game-1').overrideWith((ref) => Stream.value([activeRound])),
          gamePlayersStreamProvider(
            'game-1',
          ).overrideWith((ref) => Stream.value(const <GamePlayer>[])),
          roundAnswersStreamProvider(
            'round-1',
          ).overrideWith((ref) => Stream.value(const <GameAnswer>[])),
        ],
        child: MaterialApp(
          home: Scaffold(
            body: RoundView(gameId: 'game-1', round: activeRound, roundDurationSeconds: 10),
          ),
        ),
      ),
    );

    await tester.pump();
    await tester.pump();

    await tester.ensureVisible(find.text('La girafe'));
    await tester.tap(find.text('La girafe'));
    await tester.pump();

    verify(() => repository.submitAnswer(roundId: 'round-1', selectedOption: 2)).called(1);

    // Unmount to cancel the still-running periodic timer before teardown.
    await tester.pumpWidget(const SizedBox.shrink());
  });
}
