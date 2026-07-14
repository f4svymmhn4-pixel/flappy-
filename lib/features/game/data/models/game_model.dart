import '../../domain/entities/difficulty.dart';
import '../../domain/entities/game.dart';
import '../../domain/entities/game_status.dart';

class GameModel extends Game {
  const GameModel({
    required super.id,
    required super.visibility,
    required super.roomCode,
    required super.difficulty,
    required super.status,
    required super.maxPlayers,
    required super.minPlayers,
    required super.isSolo,
    required super.currentRound,
    required super.totalRounds,
    required super.roundDurationSeconds,
    required super.hostId,
  });

  factory GameModel.fromJson(Map<String, dynamic> json) {
    return GameModel(
      id: json['id'] as String,
      visibility: GameVisibility.fromWireValue(json['visibility'] as String),
      roomCode: json['room_code'] as String?,
      difficulty: Difficulty.fromWireValue(json['difficulty'] as String),
      status: GameStatus.fromWireValue(json['status'] as String),
      maxPlayers: json['max_players'] as int,
      minPlayers: json['min_players'] as int,
      isSolo: json['is_solo'] as bool,
      currentRound: json['current_round'] as int,
      totalRounds: json['total_rounds'] as int,
      roundDurationSeconds: json['round_duration_seconds'] as int,
      hostId: json['host_id'] as String?,
    );
  }
}
