import 'package:betiz/features/game/domain/entities/game_answer.dart';
import 'package:betiz/features/game/domain/entities/game_player.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/presentation/controllers/game_realtime_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

GamePlayer _player(String id, {GamePlayerStatus status = GamePlayerStatus.joined}) => GamePlayer(
      id: id,
      gameId: 'game-1',
      userId: 'user-$id',
      isBot: false,
      botDifficulty: null,
      animalId: 'animal-1',
      status: status,
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
  test('pairs each active player with their answer for the round', () async {
    final container = ProviderContainer(
      overrides: [
        gamePlayersStreamProvider(
          'game-1',
        ).overrideWith((ref) => Stream.value([_player('gp-1'), _player('gp-2')])),
        roundAnswersStreamProvider(
          'round-1',
        ).overrideWith((ref) => Stream.value([_answer('gp-1', selectedOption: 2)])),
      ],
    );
    addTearDown(container.dispose);

    await container.read(gamePlayersStreamProvider('game-1').future);
    await container.read(roundAnswersStreamProvider('round-1').future);

    final result = container.read(playerAnswersProvider((gameId: 'game-1', roundId: 'round-1')));

    final pairs = {for (final (player, answer) in result.value!) player.id: answer};
    expect(pairs['gp-1']?.selectedOption, 2);
    expect(pairs['gp-2'], isNull);
  });

  test('excludes players who left the game', () async {
    final container = ProviderContainer(
      overrides: [
        gamePlayersStreamProvider('game-1').overrideWith(
          (ref) => Stream.value([_player('gp-1'), _player('gp-2', status: GamePlayerStatus.left)]),
        ),
        roundAnswersStreamProvider('round-1').overrideWith((ref) => Stream.value(const [])),
      ],
    );
    addTearDown(container.dispose);

    await container.read(gamePlayersStreamProvider('game-1').future);
    await container.read(roundAnswersStreamProvider('round-1').future);

    final result = container.read(playerAnswersProvider((gameId: 'game-1', roundId: 'round-1')));

    final ids = result.value!.map((pair) => pair.$1.id).toSet();
    expect(ids, {'gp-1'});
  });
}
