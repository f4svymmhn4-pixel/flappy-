/// Mirrors the `game_status` Postgres enum.
enum GameStatus {
  waiting('waiting'),
  inProgress('in_progress'),
  finished('finished'),
  aborted('aborted');

  const GameStatus(this.wireValue);

  final String wireValue;

  static GameStatus fromWireValue(String value) {
    return GameStatus.values.firstWhere((status) => status.wireValue == value);
  }
}

/// Mirrors the `game_visibility` Postgres enum.
enum GameVisibility {
  public('public'),
  private('private');

  const GameVisibility(this.wireValue);

  final String wireValue;

  static GameVisibility fromWireValue(String value) {
    return GameVisibility.values.firstWhere((visibility) => visibility.wireValue == value);
  }
}

/// Mirrors the `game_player_status` Postgres enum.
enum GamePlayerStatus {
  joined('joined'),
  ready('ready'),
  disconnected('disconnected'),
  left('left');

  const GamePlayerStatus(this.wireValue);

  final String wireValue;

  static GamePlayerStatus fromWireValue(String value) {
    return GamePlayerStatus.values.firstWhere((status) => status.wireValue == value);
  }
}

/// Mirrors the `round_status` Postgres enum.
enum RoundStatus {
  pending('pending'),
  active('active'),
  revealed('revealed'),
  completed('completed');

  const RoundStatus(this.wireValue);

  final String wireValue;

  static RoundStatus fromWireValue(String value) {
    return RoundStatus.values.firstWhere((status) => status.wireValue == value);
  }
}
