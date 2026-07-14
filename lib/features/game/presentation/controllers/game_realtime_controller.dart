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

final StreamProviderFamily<Game?, String> gameStreamProvider =
    StreamProvider.family<Game?, String>((ref, gameId) {
  return ref.watch(gameRealtimeRepositoryProvider).watchGame(gameId);
});

final StreamProviderFamily<List<GamePlayer>, String> gamePlayersStreamProvider =
    StreamProvider.family<List<GamePlayer>, String>((ref, gameId) {
  return ref.watch(gameRealtimeRepositoryProvider).watchPlayers(gameId);
});

final StreamProviderFamily<List<GameRound>, String> gameRoundsStreamProvider =
    StreamProvider.family<List<GameRound>, String>((ref, gameId) {
  return ref.watch(gameRealtimeRepositoryProvider).watchRounds(gameId);
});

final StreamProviderFamily<List<GameAnswer>, String> roundAnswersStreamProvider =
    StreamProvider.family<List<GameAnswer>, String>((ref, roundId) {
  return ref.watch(gameRealtimeRepositoryProvider).watchAnswers(roundId);
});

final StreamProviderFamily<List<GamePlayer>, String> myGamePlayerRowsStreamProvider =
    StreamProvider.family<List<GamePlayer>, String>((ref, userId) {
  return ref.watch(gameRealtimeRepositoryProvider).watchMyGamePlayerRows(userId);
});

/// The round matching `game.currentRound`, derived from
/// [gameRoundsStreamProvider] rather than fetched separately — one
/// realtime subscription per game instead of two.
final ProviderFamily<AsyncValue<GameRound?>, String> currentRoundProvider =
    Provider.family<AsyncValue<GameRound?>, String>((ref, gameId) {
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
