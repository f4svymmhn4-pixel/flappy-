import 'package:equatable/equatable.dart';

class Profile extends Equatable {
  const Profile({
    required this.id,
    required this.pseudo,
    required this.avatarAnimalId,
    required this.tokens,
    required this.xp,
    required this.level,
    required this.gamesPlayed,
    required this.gamesWon,
    required this.totalCorrectAnswers,
    required this.totalAnswers,
    required this.avgResponseTimeMs,
  });

  final String id;
  final String? pseudo;
  final String? avatarAnimalId;
  final int tokens;
  final int xp;
  final int level;
  final int gamesPlayed;
  final int gamesWon;
  final int totalCorrectAnswers;
  final int totalAnswers;
  final int avgResponseTimeMs;

  bool get hasPseudo => pseudo != null && pseudo!.isNotEmpty;

  double get winRate => gamesPlayed == 0 ? 0 : gamesWon / gamesPlayed;

  double get accuracy => totalAnswers == 0 ? 0 : totalCorrectAnswers / totalAnswers;

  Profile copyWith({String? pseudo, String? avatarAnimalId}) {
    return Profile(
      id: id,
      pseudo: pseudo ?? this.pseudo,
      avatarAnimalId: avatarAnimalId ?? this.avatarAnimalId,
      tokens: tokens,
      xp: xp,
      level: level,
      gamesPlayed: gamesPlayed,
      gamesWon: gamesWon,
      totalCorrectAnswers: totalCorrectAnswers,
      totalAnswers: totalAnswers,
      avgResponseTimeMs: avgResponseTimeMs,
    );
  }

  @override
  List<Object?> get props => [
        id,
        pseudo,
        avatarAnimalId,
        tokens,
        xp,
        level,
        gamesPlayed,
        gamesWon,
        totalCorrectAnswers,
        totalAnswers,
        avgResponseTimeMs,
      ];
}
