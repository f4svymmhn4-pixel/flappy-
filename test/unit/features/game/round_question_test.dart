import 'package:betiz/features/game/domain/entities/round_question.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('RoundQuestion.fromJson', () {
    test('parses an active round with the correct option hidden', () {
      final question = RoundQuestion.fromJson({
        'round_id': 'round-1',
        'round_number': 2,
        'status': 'active',
        'started_at': '2026-01-01T12:00:00.000Z',
        'ends_at': '2026-01-01T12:00:10.000Z',
        'category_id': 'category-1',
        'prompt': 'Quel est le plus grand animal terrestre ?',
        'option_a': 'Le rhinocéros',
        'option_b': "L'éléphant d'Afrique",
        'option_c': 'La girafe',
        'option_d': "L'hippopotame",
        'correct_option': null,
      });

      expect(question.roundId, 'round-1');
      expect(question.roundNumber, 2);
      expect(question.options, [
        'Le rhinocéros',
        "L'éléphant d'Afrique",
        'La girafe',
        "L'hippopotame",
      ]);
      expect(question.correctOption, isNull);
      expect(question.isRevealed, isFalse);
    });

    test('parses a revealed round with the correct option present', () {
      final question = RoundQuestion.fromJson({
        'round_id': 'round-1',
        'round_number': 2,
        'status': 'revealed',
        'started_at': '2026-01-01T12:00:00.000Z',
        'ends_at': '2026-01-01T12:00:10.000Z',
        'category_id': 'category-1',
        'prompt': 'Quel est le plus grand animal terrestre ?',
        'option_a': 'Le rhinocéros',
        'option_b': "L'éléphant d'Afrique",
        'option_c': 'La girafe',
        'option_d': "L'hippopotame",
        'correct_option': 1,
      });

      expect(question.correctOption, 1);
      expect(question.isRevealed, isTrue);
    });
  });
}
