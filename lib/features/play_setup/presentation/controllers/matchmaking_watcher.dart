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
///
/// `autoDispose`d deliberately: `build()` blocks on an `await for` over a
/// live realtime stream for as long as the player is searching, so if this
/// weren't torn down the moment the matchmaking screen is left (matched,
/// cancelled, or backed out of), that loop — and the websocket
/// subscription underneath it — would keep running for the rest of the
/// app session.
class MatchmakingWatcher extends AutoDisposeFamilyAsyncNotifier<String?, String> {
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

final AutoDisposeAsyncNotifierProviderFamily<MatchmakingWatcher, String?, String>
matchmakingWatcherProvider = AsyncNotifierProvider.autoDispose
    .family<MatchmakingWatcher, String?, String>(MatchmakingWatcher.new);
