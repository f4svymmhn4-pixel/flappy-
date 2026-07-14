import '../../../../core/utils/json_parsing.dart';
import '../../domain/entities/game_round.dart';
import '../../domain/entities/game_status.dart';

class GameRoundModel extends GameRound {
  const GameRoundModel({
    required super.id,
    required super.gameId,
    required super.roundNumber,
    required super.questionId,
    required super.status,
    required super.startedAt,
    required super.endsAt,
    required super.revealedAt,
  });

  factory GameRoundModel.fromJson(Map<String, dynamic> json) {
    return GameRoundModel(
      id: json['id'] as String,
      gameId: json['game_id'] as String,
      roundNumber: json['round_number'] as int,
      questionId: json['question_id'] as String,
      status: RoundStatus.fromWireValue(json['status'] as String),
      startedAt: parseNullableTimestamp(json['started_at']),
      endsAt: parseNullableTimestamp(json['ends_at']),
      revealedAt: parseNullableTimestamp(json['revealed_at']),
    );
  }
}
