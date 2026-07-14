import 'package:equatable/equatable.dart';

import 'difficulty.dart';
import 'game_status.dart';

class GamePlayer extends Equatable {
  const GamePlayer({
    required this.id,
    required this.gameId,
    required this.userId,
    required this.isBot,
    required this.botDifficulty,
    required this.animalId,
    required this.status,
    required this.score,
    required this.correctAnswers,
  });

  final String id;
  final String gameId;
  final String? userId;
  final bool isBot;
  final Difficulty? botDifficulty;
  final String animalId;
  final GamePlayerStatus status;
  final int score;
  final int correctAnswers;

  bool get isActive => status == GamePlayerStatus.joined || status == GamePlayerStatus.ready;

  @override
  List<Object?> get props => [
        id,
        gameId,
        userId,
        isBot,
        botDifficulty,
        animalId,
        status,
        score,
        correctAnswers,
      ];
}
