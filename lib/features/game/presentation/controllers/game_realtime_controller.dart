import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/supabase_provider.dart';
import '../../data/repositories/supabase_game_realtime_repository.dart';
import '../../domain/entities/game.dart';
import '../../domain/entities/game_answer.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/game_round.dart';
import '../../domain/repositories/game_realtime_repository.dart';

final Provider<GameRealtimeRepository> gameRealtimeRepositoryProvider =
    Provider<GameRealtimeRepository>((ref) {
  return SupabaseGameRealtimeRepository(ref.watch(supabaseClientProvider));
});

// Every provider below is `.autoDispose`: each backs a live Supabase
// Realtime subscription scoped to one game/round, and a match is
// ephemeral — once nothing on screen is watching a given gameId/roundId
// anymore (the player left the game screen), the underlying websocket
// subscription should actually close instead of accumulating for the
// rest of the app session. Without autoDispose, every match ever played
// would leave its channel open forever, which is exactly the kind of
// thing that quietly burns battery and network on a phone.

final AutoDisposeStreamProviderFamily<Game?, String> gameStreamProvider = StreamProvider.autoDispose
    .family<Game?, String>((ref, gameId) {
      return ref.watch(gameRealtimeRepositoryProvider).watchGame(gameId);
    });

final AutoDisposeStreamProviderFamily<List<GamePlayer>, String> gamePlayersStreamProvider =
    StreamProvider.autoDispose.family<List<GamePlayer>, String>((ref, gameId) {
      return ref.watch(gameRealtimeRepositoryProvider).watchPlayers(gameId);
    });

final AutoDisposeStreamProviderFamily<List<GameRound>, String> gameRoundsStreamProvider =
    StreamProvider.autoDispose.family<List<GameRound>, String>((ref, gameId) {
      return ref.watch(gameRealtimeRepositoryProvider).watchRounds(gameId);
    });

final AutoDisposeStreamProviderFamily<List<GameAnswer>, String> roundAnswersStreamProvider =
    StreamProvider.autoDispose.family<List<GameAnswer>, String>((ref, roundId) {
      return ref.watch(gameRealtimeRepositoryProvider).watchAnswers(roundId);
    });

final AutoDisposeStreamProviderFamily<List<GamePlayer>, String> myGamePlayerRowsStreamProvider =
    StreamProvider.autoDispose.family<List<GamePlayer>, String>((ref, userId) {
      return ref.watch(gameRealtimeRepositoryProvider).watchMyGamePlayerRows(userId);
    });

/// The round matching `game.currentRound`, derived from
/// [gameRoundsStreamProvider] rather than fetched separately — one
/// realtime subscription per game instead of two.
final AutoDisposeProviderFamily<AsyncValue<GameRound?>, String> currentRoundProvider = Provider
    .autoDispose
    .family<AsyncValue<GameRound?>, String>((ref, gameId) {
      final AsyncValue<Game?> game = ref.watch(gameStreamProvider(gameId));
      final AsyncValue<List<GameRound>> rounds = ref.watch(gameRoundsStreamProvider(gameId));

      if (game.isLoading || rounds.isLoading) return const AsyncLoading();

      final Object? error = game.error ?? rounds.error;
      if (error != null) {
        return AsyncError(error, game.stackTrace ?? rounds.stackTrace ?? StackTrace.current);
      }

      final int? currentRoundNumber = game.value?.currentRound;
      final List<GameRound> roundList = rounds.value ?? const [];
      GameRound? current;
      if (currentRoundNumber != null) {
        for (final round in roundList) {
          if (round.roundNumber == currentRoundNumber) {
            current = round;
            break;
          }
        }
      }

      return AsyncData(current);
    });

/// Every active player in [gameId], paired with their (possibly absent)
/// answer for [roundId] — one lookup the animal-placement UI needs instead
/// of cross-referencing two separate streams itself.
final AutoDisposeProviderFamily<
  AsyncValue<List<(GamePlayer, GameAnswer?)>>,
  ({String gameId, String roundId})
>
playerAnswersProvider = Provider.autoDispose
    .family<AsyncValue<List<(GamePlayer, GameAnswer?)>>, ({String gameId, String roundId})>((
      ref,
      args,
    ) {
      final AsyncValue<List<GamePlayer>> players = ref.watch(gamePlayersStreamProvider(args.gameId));
      final AsyncValue<List<GameAnswer>> answers = ref.watch(roundAnswersStreamProvider(args.roundId));

      if (players.isLoading || answers.isLoading) return const AsyncLoading();

      final Object? error = players.error ?? answers.error;
      if (error != null) {
        return AsyncError(error, players.stackTrace ?? answers.stackTrace ?? StackTrace.current);
      }

      final Map<String, GameAnswer> byPlayerId = {
        for (final answer in answers.value ?? const <GameAnswer>[]) answer.gamePlayerId: answer,
      };

      final List<(GamePlayer, GameAnswer?)> paired = [
        for (final player in players.value ?? const <GamePlayer>[])
          if (player.isActive) (player, byPlayerId[player.id]),
      ];

      return AsyncData(paired);
    });
