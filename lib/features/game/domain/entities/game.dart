import 'package:equatable/equatable.dart';

import 'difficulty.dart';
import 'game_status.dart';

class Game extends Equatable {
  const Game({
    required this.id,
    required this.visibility,
    required this.roomCode,
    required this.difficulty,
    required this.status,
    required this.maxPlayers,
    required this.minPlayers,
    required this.isSolo,
    required this.currentRound,
    required this.totalRounds,
    required this.roundDurationSeconds,
    required this.hostId,
  });

  final String id;
  final GameVisibility visibility;
  final String? roomCode;
  final Difficulty difficulty;
  final GameStatus status;
  final int maxPlayers;
  final int minPlayers;
  final bool isSolo;
  final int currentRound;
  final int totalRounds;
  final int roundDurationSeconds;
  final String? hostId;

  @override
  List<Object?> get props => [
        id,
        visibility,
        roomCode,
        difficulty,
        status,
        maxPlayers,
        minPlayers,
        isSolo,
        currentRound,
        totalRounds,
        roundDurationSeconds,
        hostId,
      ];
}
