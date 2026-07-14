import '../../../../core/error/result.dart';
import '../entities/difficulty.dart';

/// Wraps the SECURITY DEFINER RPCs that create/join/start a match (see
/// supabase/migrations/0011-0020). Every mutation that affects a game goes
/// through here rather than a direct table write — the tables themselves
/// have no client-facing INSERT/UPDATE policy by design (Step 2/3).
abstract interface class GameLifecycleRepository {
  Future<Result<({String gameId, String roomCode})>> createPrivateGame({
    required Difficulty difficulty,
    required String animalId,
  });

  Future<Result<String>> joinPrivateGame({
    required String roomCode,
    required String animalId,
  });

  Future<Result<void>> startPrivateGame(String gameId);

  Future<Result<void>> leaveGame(String gameId);

  /// Joins the public matchmaking queue. If this call happens to be the
  /// one that completes a group of 5, the match already exists by the
  /// time this returns (`matched: true, gameId: ...`); otherwise the
  /// caller should watch `myGamePlayerRowsStreamProvider` for the match to
  /// appear once someone else completes the group.
  Future<Result<({bool matched, String? gameId})>> joinMatchmaking({
    required Difficulty difficulty,
    required String animalId,
  });

  Future<Result<void>> leaveMatchmaking();

  Future<Result<String>> startSoloGame({
    required Difficulty difficulty,
    required String animalId,
  });

  /// The id of a game [userId] is still an active participant of and that
  /// is still `in_progress`, if any — checked once on app launch so a
  /// relaunch after a dropped connection can offer "resume game" instead
  /// of stranding the player in a match the other side still sees them in.
  Future<Result<String?>> findResumableGame(String userId);
}
