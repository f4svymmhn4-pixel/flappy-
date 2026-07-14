import '../entities/game.dart';
import '../entities/game_answer.dart';
import '../entities/game_player.dart';
import '../entities/game_round.dart';

/// Live views over a match, backed by Supabase Realtime (Postgres change
/// streams). Unlike [Result]-returning repositories elsewhere, these
/// streams surface errors through their own error channel — Riverpod's
/// `StreamProvider` turns that into an `AsyncError` natively, so there's
/// no benefit to wrapping every emission in a `Result`.
abstract interface class GameRealtimeRepository {
  /// Emits the game's row every time it changes, or `null` if the id
  /// doesn't resolve to a row currently visible under RLS (not a
  /// participant, and not an open public lobby).
  Stream<Game?> watchGame(String gameId);

  /// All players currently seated in [gameId] (bots included), updated in
  /// real time as people join, leave, or their score changes.
  Stream<List<GamePlayer>> watchPlayers(String gameId);

  /// Every round created so far for [gameId], in round-number order.
  Stream<List<GameRound>> watchRounds(String gameId);

  /// Every answer submitted for [roundId] so far.
  Stream<List<GameAnswer>> watchAnswers(String roundId);

  /// [userId]'s own `game_players` rows across every game, most recent
  /// first. RLS lets a user see their own row the instant it's inserted —
  /// even in a game they never queried for by id — which is exactly what
  /// lets a waiting matchmaking client notice "I've been placed into a
  /// game" without knowing the game id in advance, and what lets the app
  /// offer "resume game" on relaunch.
  Stream<List<GamePlayer>> watchMyGamePlayerRows(String userId);
}
