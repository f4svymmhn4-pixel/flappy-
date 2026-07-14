/// Mirrors the `difficulty_level` Postgres enum. Owned by the game feature
/// since difficulty is fundamentally a game-setup concept; other features
/// (play_setup, matchmaking) import it from here rather than redeclaring it.
enum Difficulty {
  easy('easy', 'Facile'),
  medium('medium', 'Moyen'),
  hard('hard', 'Difficile');

  const Difficulty(this.wireValue, this.label);

  /// The exact string Postgres expects/returns for this enum value.
  final String wireValue;
  final String label;

  static Difficulty fromWireValue(String value) {
    return Difficulty.values.firstWhere((difficulty) => difficulty.wireValue == value);
  }
}
