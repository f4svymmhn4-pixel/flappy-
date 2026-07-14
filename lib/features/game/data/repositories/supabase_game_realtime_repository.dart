import 'package:supabase_flutter/supabase_flutter.dart';

import '../../domain/entities/game.dart';
import '../../domain/entities/game_answer.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/game_round.dart';
import '../../domain/repositories/game_realtime_repository.dart';
import '../models/game_answer_model.dart';
import '../models/game_model.dart';
import '../models/game_player_model.dart';
import '../models/game_round_model.dart';

class SupabaseGameRealtimeRepository implements GameRealtimeRepository {
  SupabaseGameRealtimeRepository(this._client);

  final SupabaseClient _client;

  @override
  Stream<Game?> watchGame(String gameId) {
    return _client
        .from('games')
        .stream(primaryKey: ['id'])
        .eq('id', gameId)
        .map((rows) => rows.isEmpty ? null : GameModel.fromJson(rows.first));
  }

  @override
  Stream<List<GamePlayer>> watchPlayers(String gameId) {
    return _client
        .from('game_players')
        .stream(primaryKey: ['id'])
        .eq('game_id', gameId)
        .map((rows) => rows.map(GamePlayerModel.fromJson).toList(growable: false));
  }

  @override
  Stream<List<GameRound>> watchRounds(String gameId) {
    return _client
        .from('game_rounds')
        .stream(primaryKey: ['id'])
        .eq('game_id', gameId)
        .order('round_number')
        .map((rows) => rows.map(GameRoundModel.fromJson).toList(growable: false));
  }

  @override
  Stream<List<GameAnswer>> watchAnswers(String roundId) {
    return _client
        .from('game_answers')
        .stream(primaryKey: ['id'])
        .eq('round_id', roundId)
        .map((rows) => rows.map(GameAnswerModel.fromJson).toList(growable: false));
  }
}
