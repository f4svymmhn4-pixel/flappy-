import 'package:equatable/equatable.dart';

import 'game_status.dart';

class GameRound extends Equatable {
  const GameRound({
    required this.id,
    required this.gameId,
    required this.roundNumber,
    required this.questionId,
    required this.status,
    required this.startedAt,
    required this.endsAt,
    required this.revealedAt,
  });

  final String id;
  final String gameId;
  final int roundNumber;
  final String questionId;
  final RoundStatus status;
  final DateTime? startedAt;
  final DateTime? endsAt;
  final DateTime? revealedAt;

  /// How long is left before the round ends, clamped to zero. Always
  /// computed against the device clock at call time — the server-issued
  /// [endsAt] is the source of truth, but rendering a live countdown needs
  /// a fresh `Duration` on every tick.
  Duration remaining({DateTime Function() now = DateTime.now}) {
    if (endsAt == null) return Duration.zero;
    final Duration diff = endsAt!.difference(now());
    return diff.isNegative ? Duration.zero : diff;
  }

  @override
  List<Object?> get props => [
        id,
        gameId,
        roundNumber,
        questionId,
        status,
        startedAt,
        endsAt,
        revealedAt,
      ];
}
