import '../../../../core/utils/json_parsing.dart';
import '../../domain/entities/game_answer.dart';

class GameAnswerModel extends GameAnswer {
  const GameAnswerModel({
    required super.id,
    required super.roundId,
    required super.gamePlayerId,
    required super.selectedOption,
    required super.isCorrect,
    required super.answeredAt,
    required super.responseTimeMs,
    required super.pointsAwarded,
    required super.rankWhenCorrect,
  });

  factory GameAnswerModel.fromJson(Map<String, dynamic> json) {
    return GameAnswerModel(
      id: json['id'] as String,
      roundId: json['round_id'] as String,
      gamePlayerId: json['game_player_id'] as String,
      selectedOption: json['selected_option'] as int?,
      isCorrect: json['is_correct'] as bool?,
      answeredAt: parseNullableTimestamp(json['answered_at']),
      responseTimeMs: json['response_time_ms'] as int?,
      pointsAwarded: json['points_awarded'] as int,
      rankWhenCorrect: json['rank_when_correct'] as int?,
    );
  }
}
