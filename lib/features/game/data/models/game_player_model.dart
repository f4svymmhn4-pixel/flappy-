import '../../domain/entities/difficulty.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/game_status.dart';

class GamePlayerModel extends GamePlayer {
  const GamePlayerModel({
    required super.id,
    required super.gameId,
    required super.userId,
    required super.isBot,
    required super.botDifficulty,
    required super.animalId,
    required super.status,
    required super.score,
    required super.correctAnswers,
  });

  factory GamePlayerModel.fromJson(Map<String, dynamic> json) {
    final String? botDifficultyWire = json['bot_difficulty'] as String?;
    return GamePlayerModel(
      id: json['id'] as String,
      gameId: json['game_id'] as String,
      userId: json['user_id'] as String?,
      isBot: json['is_bot'] as bool,
      botDifficulty: botDifficultyWire == null
          ? null
          : Difficulty.fromWireValue(botDifficultyWire),
      animalId: json['animal_id'] as String,
      status: GamePlayerStatus.fromWireValue(json['status'] as String),
      score: json['score'] as int,
      correctAnswers: json['correct_answers'] as int,
    );
  }
}
