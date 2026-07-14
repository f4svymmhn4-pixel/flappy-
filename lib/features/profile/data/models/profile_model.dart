import '../../domain/entities/profile.dart';

/// Maps the `profiles` table's snake_case JSON (as returned by Postgrest)
/// to/from the domain [Profile] entity.
class ProfileModel extends Profile {
  const ProfileModel({
    required super.id,
    required super.pseudo,
    required super.avatarAnimalId,
    required super.tokens,
    required super.xp,
    required super.level,
    required super.gamesPlayed,
    required super.gamesWon,
    required super.totalCorrectAnswers,
    required super.totalAnswers,
    required super.avgResponseTimeMs,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: json['id'] as String,
      pseudo: json['pseudo'] as String?,
      avatarAnimalId: json['avatar_animal_id'] as String?,
      tokens: json['tokens'] as int,
      xp: json['xp'] as int,
      level: json['level'] as int,
      gamesPlayed: json['games_played'] as int,
      gamesWon: json['games_won'] as int,
      totalCorrectAnswers: json['total_correct_answers'] as int,
      totalAnswers: json['total_answers'] as int,
      avgResponseTimeMs: json['avg_response_time_ms'] as int,
    );
  }
}
