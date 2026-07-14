import 'package:betiz/features/game/domain/entities/difficulty.dart';
import 'package:betiz/features/game/domain/entities/game.dart';
import 'package:betiz/features/game/domain/entities/game_round.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/presentation/controllers/game_realtime_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

Game _game({required int currentRound}) => Game(
      id: 'game-1',
      visibility: GameVisibility.public,
      roomCode: null,
      difficulty: Difficulty.easy,
      status: GameStatus.inProgress,
      maxPlayers: 5,
      minPlayers: 2,
      isSolo: false,
      currentRound: currentRound,
      totalRounds: 5,
      roundDurationSeconds: 10,
      hostId: 'user-1',
    );

GameRound _round(int number) => GameRound(
      id: 'round-$number',
      gameId: 'game-1',
      roundNumber: number,
      questionId: 'question-$number',
      status: RoundStatus.active,
      startedAt: null,
      endsAt: null,
      revealedAt: null,
    );

void main() {
  test('resolves to the round whose number matches game.currentRound', () async {
    final container = ProviderContainer(
      overrides: [
        gameStreamProvider('game-1').overrideWith((ref) => Stream.value(_game(currentRound: 2))),
        gameRoundsStreamProvider(
          'game-1',
        ).overrideWith((ref) => Stream.value([_round(1), _round(2), _round(3)])),
      ],
    );
    addTearDown(container.dispose);

    await container.read(gameStreamProvider('game-1').future);
    await container.read(gameRoundsStreamProvider('game-1').future);

    final result = container.read(currentRoundProvider('game-1'));

    expect(result.value?.roundNumber, 2);
  });

  test('resolves to null while no round has started yet', () async {
    final container = ProviderContainer(
      overrides: [
        gameStreamProvider('game-1').overrideWith((ref) => Stream.value(_game(currentRound: 0))),
        gameRoundsStreamProvider('game-1').overrideWith((ref) => Stream.value(const [])),
      ],
    );
    addTearDown(container.dispose);

    await container.read(gameStreamProvider('game-1').future);
    await container.read(gameRoundsStreamProvider('game-1').future);

    final result = container.read(currentRoundProvider('game-1'));

    expect(result.value, isNull);
  });

  test('surfaces an error from either underlying stream', () async {
    final container = ProviderContainer(
      overrides: [
        gameStreamProvider(
          'game-1',
        ).overrideWith((ref) => Stream<Game?>.error(StateError('boom'))),
        gameRoundsStreamProvider('game-1').overrideWith((ref) => Stream.value(const [])),
      ],
    );
    addTearDown(container.dispose);

    await container.read(gameRoundsStreamProvider('game-1').future);
    try {
      await container.read(gameStreamProvider('game-1').future);
    } on StateError {
      // Expected — we only awaited it to let the provider settle.
    }

    final result = container.read(currentRoundProvider('game-1'));

    expect(result.hasError, isTrue);
  });
}
