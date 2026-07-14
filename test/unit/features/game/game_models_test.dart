import 'package:betiz/features/game/data/models/game_answer_model.dart';
import 'package:betiz/features/game/data/models/game_model.dart';
import 'package:betiz/features/game/data/models/game_player_model.dart';
import 'package:betiz/features/game/data/models/game_round_model.dart';
import 'package:betiz/features/game/domain/entities/difficulty.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('GameModel.fromJson', () {
    test('parses a public in-progress game', () {
      final game = GameModel.fromJson({
        'id': 'game-1',
        'visibility': 'public',
        'room_code': null,
        'difficulty': 'medium',
        'status': 'in_progress',
        'max_players': 5,
        'min_players': 2,
        'is_solo': false,
        'current_round': 3,
        'total_rounds': 5,
        'round_duration_seconds': 10,
        'host_id': 'user-1',
      });

      expect(game.id, 'game-1');
      expect(game.visibility, GameVisibility.public);
      expect(game.roomCode, isNull);
      expect(game.difficulty, Difficulty.medium);
      expect(game.status, GameStatus.inProgress);
      expect(game.currentRound, 3);
      expect(game.isSolo, isFalse);
    });

    test('parses a private waiting game with a room code', () {
      final game = GameModel.fromJson({
        'id': 'game-2',
        'visibility': 'private',
        'room_code': 'ABC123',
        'difficulty': 'easy',
        'status': 'waiting',
        'max_players': 5,
        'min_players': 2,
        'is_solo': false,
        'current_round': 0,
        'total_rounds': 5,
        'round_duration_seconds': 10,
        'host_id': 'user-2',
      });

      expect(game.visibility, GameVisibility.private);
      expect(game.roomCode, 'ABC123');
      expect(game.status, GameStatus.waiting);
    });
  });

  group('GamePlayerModel.fromJson', () {
    test('parses a human player', () {
      final player = GamePlayerModel.fromJson({
        'id': 'gp-1',
        'game_id': 'game-1',
        'user_id': 'user-1',
        'is_bot': false,
        'bot_difficulty': null,
        'animal_id': 'animal-1',
        'status': 'joined',
        'score': 6,
        'correct_answers': 2,
      });

      expect(player.userId, 'user-1');
      expect(player.isBot, isFalse);
      expect(player.botDifficulty, isNull);
      expect(player.score, 6);
      expect(player.isActive, isTrue);
    });

    test('parses a bot player', () {
      final player = GamePlayerModel.fromJson({
        'id': 'gp-2',
        'game_id': 'game-1',
        'user_id': null,
        'is_bot': true,
        'bot_difficulty': 'hard',
        'animal_id': 'animal-2',
        'status': 'joined',
        'score': 0,
        'correct_answers': 0,
      });

      expect(player.userId, isNull);
      expect(player.isBot, isTrue);
      expect(player.botDifficulty, Difficulty.hard);
    });

    test('a player who left is not active', () {
      final player = GamePlayerModel.fromJson({
        'id': 'gp-3',
        'game_id': 'game-1',
        'user_id': 'user-3',
        'is_bot': false,
        'bot_difficulty': null,
        'animal_id': 'animal-3',
        'status': 'left',
        'score': 3,
        'correct_answers': 1,
      });

      expect(player.isActive, isFalse);
    });
  });

  group('GameRoundModel.fromJson', () {
    test('parses timestamps and computes remaining time', () {
      final now = DateTime.utc(2026, 1, 1, 12, 0, 5);
      final round = GameRoundModel.fromJson({
        'id': 'round-1',
        'game_id': 'game-1',
        'round_number': 2,
        'question_id': 'question-1',
        'status': 'active',
        'started_at': '2026-01-01T12:00:00.000Z',
        'ends_at': '2026-01-01T12:00:10.000Z',
        'revealed_at': null,
      });

      expect(round.status, RoundStatus.active);
      expect(round.remaining(now: () => now), const Duration(seconds: 5));
    });

    test('remaining time never goes negative once ends_at is passed', () {
      final now = DateTime.utc(2026, 1, 1, 12, 0, 20);
      final round = GameRoundModel.fromJson({
        'id': 'round-1',
        'game_id': 'game-1',
        'round_number': 1,
        'question_id': 'question-1',
        'status': 'revealed',
        'started_at': '2026-01-01T12:00:00.000Z',
        'ends_at': '2026-01-01T12:00:10.000Z',
        'revealed_at': '2026-01-01T12:00:11.000Z',
      });

      expect(round.remaining(now: () => now), Duration.zero);
    });

    test('remaining time is zero when ends_at is null', () {
      final round = GameRoundModel.fromJson({
        'id': 'round-1',
        'game_id': 'game-1',
        'round_number': 1,
        'question_id': 'question-1',
        'status': 'pending',
        'started_at': null,
        'ends_at': null,
        'revealed_at': null,
      });

      expect(round.remaining(), Duration.zero);
    });
  });

  group('GameAnswerModel.fromJson', () {
    test('parses an answered, correct submission', () {
      final answer = GameAnswerModel.fromJson({
        'id': 'answer-1',
        'round_id': 'round-1',
        'game_player_id': 'gp-1',
        'selected_option': 2,
        'is_correct': true,
        'answered_at': '2026-01-01T12:00:03.000Z',
        'response_time_ms': 3000,
        'points_awarded': 3,
        'rank_when_correct': 1,
      });

      expect(answer.hasAnswered, isTrue);
      expect(answer.isCorrect, isTrue);
      expect(answer.pointsAwarded, 3);
    });

    test('parses a not-yet-answered row as such', () {
      final answer = GameAnswerModel.fromJson({
        'id': 'answer-2',
        'round_id': 'round-1',
        'game_player_id': 'gp-2',
        'selected_option': null,
        'is_correct': null,
        'answered_at': null,
        'response_time_ms': null,
        'points_awarded': 0,
        'rank_when_correct': null,
      });

      expect(answer.hasAnswered, isFalse);
      expect(answer.isCorrect, isNull);
    });
  });
}
