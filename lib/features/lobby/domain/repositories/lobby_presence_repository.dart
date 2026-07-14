/// Live "who is actually connected right now" for a game's lobby, backed
/// by Supabase Realtime Presence rather than a `game_players.status`
/// column — presence reflects the socket connection itself, so it
/// survives an app crash or a lost connection without any extra
/// heartbeat/timeout logic on our side.
abstract interface class LobbyPresenceRepository {
  /// Joins the presence channel for [gameId] under key [selfUserId],
  /// broadcasting [selfPayload] (pseudo, animal id, ...) to the other
  /// participants, and emits the set of currently-online user ids on every
  /// join/leave. The channel is torn down when the stream is cancelled —
  /// callers get "I've left" semantics for free by disposing the
  /// subscription (widget disposal, navigating away, ...).
  Stream<Set<String>> watchOnlinePlayers({
    required String gameId,
    required String selfUserId,
    required Map<String, dynamic> selfPayload,
  });
}
