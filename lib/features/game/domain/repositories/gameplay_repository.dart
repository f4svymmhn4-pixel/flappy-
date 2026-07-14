import '../../../../core/error/result.dart';
import '../entities/round_question.dart';

/// Wraps the RPCs that drive a round once a game is `in_progress` (see
/// supabase/migrations 0015: submit_answer/reveal_round/advance_game, and
/// 0020: get_round_question). Distinct from [GameLifecycleRepository],
/// which only covers creating/joining/starting a game.
abstract interface class GameplayRepository {
  Future<Result<RoundQuestion>> getRoundQuestion(String roundId);

  /// Response time is computed server-side from the round's started_at —
  /// never send a client-measured duration, it can't be trusted.
  Future<Result<void>> submitAnswer({required String roundId, required int selectedOption});

  /// Safe to call from any participant's client, and safe to call more
  /// than once — see supabase/migrations/0015_gameplay.sql.
  Future<Result<void>> revealRound(String roundId);

  Future<Result<void>> advanceGame(String gameId);

  /// The token amount `finish_game` credited [userId] for [gameId], or
  /// `null` if the game hasn't been settled yet (or they're a bot). Reads
  /// `token_transactions` directly rather than a dedicated RPC — it's
  /// already an append-only ledger the player can read their own rows
  /// from (see supabase/migrations/0010_rls_policies.sql).
  Future<Result<int?>> getMyGameTokenReward({required String gameId, required String userId});
}
