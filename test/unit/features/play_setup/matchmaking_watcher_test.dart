import 'dart:async';

import 'package:betiz/features/game/domain/entities/game.dart';
import 'package:betiz/features/game/domain/entities/game_answer.dart';
import 'package:betiz/features/game/domain/entities/game_player.dart';
import 'package:betiz/features/game/domain/entities/game_round.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/domain/repositories/game_realtime_repository.dart';
import 'package:betiz/features/game/presentation/controllers/game_realtime_controller.dart';
import 'package:betiz/features/play_setup/presentation/controllers/matchmaking_watcher.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeGameRealtimeRepository implements GameRealtimeRepository {
  _FakeGameRealtimeRepository(this._controller);

  final StreamController<List<GamePlayer>> _controller;

  @override
  Stream<List<GamePlayer>> watchMyGamePlayerRows(String userId) => _controller.stream;

  @override
  Stream<Game?> watchGame(String gameId) => throw UnimplementedError();
  @override
  Stream<List<GamePlayer>> watchPlayers(String gameId) => throw UnimplementedError();
  @override
  Stream<List<GameRound>> watchRounds(String gameId) => throw UnimplementedError();
  @override
  Stream<List<GameAnswer>> watchAnswers(String roundId) => throw UnimplementedError();
}

GamePlayer _player({required String gameId, GamePlayerStatus status = GamePlayerStatus.joined}) {
  return GamePlayer(
    id: 'gp-$gameId',
    gameId: gameId,
    userId: 'user-1',
    isBot: false,
    botDifficulty: null,
    animalId: 'animal-1',
    status: status,
    score: 0,
    correctAnswers: 0,
  );
}

void main() {
  test('an active row present from the very first emission is NOT treated as a match', () async {
    final controller = StreamController<List<GamePlayer>>();
    final container = ProviderContainer(
      overrides: [
        gameRealtimeRepositoryProvider.overrideWithValue(_FakeGameRealtimeRepository(controller)),
      ],
    );
    addTearDown(container.dispose);
    addTearDown(controller.close);

    final future = container.read(matchmakingWatcherProvider('user-1').future);

    controller.add([_player(gameId: 'old-game')]);
    await Future<void>.delayed(Duration.zero);

    expect(container.read(matchmakingWatcherProvider('user-1')).isLoading, isTrue);

    unawaited(controller.close());
    expect(await future.timeout(const Duration(seconds: 1), onTimeout: () => null), isNull);
  });

  test('a game id appearing after the baseline resolves as the match', () async {
    final controller = StreamController<List<GamePlayer>>();
    final container = ProviderContainer(
      overrides: [
        gameRealtimeRepositoryProvider.overrideWithValue(_FakeGameRealtimeRepository(controller)),
      ],
    );
    addTearDown(container.dispose);
    addTearDown(controller.close);

    final future = container.read(matchmakingWatcherProvider('user-1').future);

    controller.add([_player(gameId: 'old-game')]);
    await Future<void>.delayed(Duration.zero);

    controller.add([_player(gameId: 'old-game'), _player(gameId: 'new-game')]);

    expect(await future, 'new-game');
  });

  test('a row with status "left" never counts as a match', () async {
    final controller = StreamController<List<GamePlayer>>();
    final container = ProviderContainer(
      overrides: [
        gameRealtimeRepositoryProvider.overrideWithValue(_FakeGameRealtimeRepository(controller)),
      ],
    );
    addTearDown(container.dispose);
    addTearDown(controller.close);

    final future = container.read(matchmakingWatcherProvider('user-1').future);

    controller.add(const <GamePlayer>[]);
    await Future<void>.delayed(Duration.zero);

    controller.add([_player(gameId: 'new-game', status: GamePlayerStatus.left)]);
    await Future<void>.delayed(Duration.zero);
    unawaited(controller.close());

    expect(await future.timeout(const Duration(seconds: 1), onTimeout: () => null), isNull);
  });
}
