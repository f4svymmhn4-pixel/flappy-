import 'package:betiz/features/profile/data/models/profile_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ProfileModel.fromJson', () {
    test('parses a fresh account with no pseudo yet', () {
      final profile = ProfileModel.fromJson({
        'id': 'user-1',
        'pseudo': null,
        'avatar_animal_id': null,
        'tokens': 0,
        'xp': 0,
        'level': 1,
        'games_played': 0,
        'games_won': 0,
        'total_correct_answers': 0,
        'total_answers': 0,
        'avg_response_time_ms': 0,
      });

      expect(profile.hasPseudo, isFalse);
      expect(profile.winRate, 0);
      expect(profile.accuracy, 0);
    });

    test('parses an established account and computes rates correctly', () {
      final profile = ProfileModel.fromJson({
        'id': 'user-1',
        'pseudo': 'Renard',
        'avatar_animal_id': 'animal-1',
        'tokens': 500,
        'xp': 1200,
        'level': 3,
        'games_played': 10,
        'games_won': 4,
        'total_correct_answers': 30,
        'total_answers': 50,
        'avg_response_time_ms': 3200,
      });

      expect(profile.hasPseudo, isTrue);
      expect(profile.winRate, 0.4);
      expect(profile.accuracy, 0.6);
    });
  });
}
