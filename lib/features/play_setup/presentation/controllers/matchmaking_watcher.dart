import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../game/domain/entities/game_player.dart';
import '../../../game/presentation/controllers/game_realtime_controller.dart';

/// Resolves once the queued player has actually been placed into a game.
///
/// A player can already have `game_players` rows from past matches, so
/// "an active row exists" isn't itself the signal — the first emission
/// from the repository stream is instead treated as the baseline, and
/// only a game id that shows up *after* that baseline counts as a fresh
/// match. Without this, opening the matchmaking screen after playing any
/// earlier game would look like an instant match.
class MatchmakingWatcher extends FamilyAsyncNotifier<String?, String> {
  Set<String>? _baselineGameIds;

  @override
  Future<String?> build(String userId) async {
    final Stream<List<GamePlayer>> stream = ref
        .watch(gameRealtimeRepositoryProvider)
        .watchMyGamePlayerRows(userId);

    await for (final rows in stream) {
      final Set<String> activeGameIds = rows
          .where((player) => player.isActive)
          .map((player) => player.gameId)
          .toSet();

      final Set<String>? baseline = _baselineGameIds;
      if (baseline == null) {
        _baselineGameIds = activeGameIds;
        continue;
      }

      final Set<String> newGameIds = activeGameIds.difference(baseline);
      if (newGameIds.isNotEmpty) {
        return newGameIds.first;
      }
    }
    return null;
  }
}

final AsyncNotifierProviderFamily<MatchmakingWatcher, String?, String>
matchmakingWatcherProvider = AsyncNotifierProvider.family<MatchmakingWatcher, String?, String>(
  MatchmakingWatcher.new,
);
