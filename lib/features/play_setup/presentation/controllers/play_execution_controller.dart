import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/error/failure.dart';
import '../../../game/domain/entities/difficulty.dart';
import '../../../game/presentation/controllers/game_lifecycle_controller.dart';
import '../../domain/play_mode.dart';
import 'play_setup_controller.dart';

/// Where [PlayExecutionController.execute] sends the player next.
sealed class PlayOutcome {
  const PlayOutcome();
}

/// A private lobby was created or joined; show the waiting room.
final class PlayOutcomeLobby extends PlayOutcome {
  const PlayOutcomeLobby(this.gameId);
  final String gameId;
}

/// Solo mode (or the rare case of being the 5th matchmaking player) starts
/// a game immediately — no lobby to wait in.
final class PlayOutcomeGameStarted extends PlayOutcome {
  const PlayOutcomeGameStarted(this.gameId);
  final String gameId;
}

/// Queued for public matchmaking; the caller should watch
/// `myGamePlayerRowsStreamProvider` for the match to appear.
final class PlayOutcomeQueued extends PlayOutcome {
  const PlayOutcomeQueued();
}

/// Turns the choices collected in [PlaySetupController] into the one RPC
/// call that actually creates/joins/starts a game, so the play_setup
/// screens themselves stay free of branching on [PlayMode].
class PlayExecutionController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<PlayOutcome?> execute() async {
    // Building is a trivial no-op, but it's still asynchronous — without
    // this, a caller that reads the notifier and calls execute() in the
    // same synchronous stack (any real caller does, since watching the
    // provider from a widget already forces this) could have its
    // synchronous `state = AsyncError(...)` below clobbered right back to
    // AsyncData(null) once `build` finishes on the next microtask.
    await future;

    final PlaySetupState setup = ref.read(playSetupControllerProvider);
    if (!setup.isReadyToExecute) {
      state = AsyncError(
        const ValidationFailure('Choix de partie incomplet.'),
        StackTrace.current,
      );
      return null;
    }

    state = const AsyncLoading();
    final repository = ref.read(gameLifecycleRepositoryProvider);
    final Difficulty? difficulty = setup.difficulty;
    final String animalId = setup.animalId!;

    final PlayOutcome? outcome = await switch (setup.mode!) {
      PlayMode.createPrivate => (await repository.createPrivateGame(
          difficulty: difficulty!,
          animalId: animalId,
        )).when(
          success: (result) => PlayOutcomeLobby(result.gameId),
          failure: _fail,
        ),
      PlayMode.joinPrivate => (await repository.joinPrivateGame(
          roomCode: setup.roomCode!,
          animalId: animalId,
        )).when(success: PlayOutcomeLobby.new, failure: _fail),
      PlayMode.quickMatch => (await repository.joinMatchmaking(
          difficulty: difficulty!,
          animalId: animalId,
        )).when(
          success: (result) => result.matched
              ? PlayOutcomeGameStarted(result.gameId!)
              : const PlayOutcomeQueued(),
          failure: _fail,
        ),
      PlayMode.solo => (await repository.startSoloGame(
          difficulty: difficulty!,
          animalId: animalId,
        )).when(success: PlayOutcomeGameStarted.new, failure: _fail),
    };

    if (outcome != null) {
      state = const AsyncData(null);
    }
    return outcome;
  }

  Future<void> cancelMatchmaking() async {
    await future;
    final result = await ref.read(gameLifecycleRepositoryProvider).leaveMatchmaking();
    result.when(
      success: (_) {},
      failure: (failure) => state = AsyncError(failure, StackTrace.current),
    );
  }

  PlayOutcome? _fail(Failure failure) {
    state = AsyncError(failure, StackTrace.current);
    return null;
  }
}

final AsyncNotifierProvider<PlayExecutionController, void> playExecutionControllerProvider =
    AsyncNotifierProvider<PlayExecutionController, void>(PlayExecutionController.new);
