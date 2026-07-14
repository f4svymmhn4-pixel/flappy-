import 'package:equatable/equatable.dart';

class GameAnswer extends Equatable {
  const GameAnswer({
    required this.id,
    required this.roundId,
    required this.gamePlayerId,
    required this.selectedOption,
    required this.isCorrect,
    required this.answeredAt,
    required this.responseTimeMs,
    required this.pointsAwarded,
    required this.rankWhenCorrect,
  });

  final String id;
  final String roundId;
  final String gamePlayerId;
  final int? selectedOption;
  final bool? isCorrect;
  final DateTime? answeredAt;
  final int? responseTimeMs;
  final int pointsAwarded;
  final int? rankWhenCorrect;

  bool get hasAnswered => selectedOption != null;

  @override
  List<Object?> get props => [
        id,
        roundId,
        gamePlayerId,
        selectedOption,
        isCorrect,
        answeredAt,
        responseTimeMs,
        pointsAwarded,
        rankWhenCorrect,
      ];
}
