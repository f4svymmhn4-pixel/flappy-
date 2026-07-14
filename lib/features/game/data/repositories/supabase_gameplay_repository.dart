import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../../../core/network/rpc_error_mapper.dart';
import '../../domain/entities/round_question.dart';
import '../../domain/repositories/gameplay_repository.dart';

class SupabaseGameplayRepository implements GameplayRepository {
  SupabaseGameplayRepository(this._client, this._networkInfo);

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  Future<Result<RoundQuestion>> getRoundQuestion(String roundId) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'get_round_question',
        params: {'p_round_id': roundId},
      );
      return RoundQuestion.fromJson(json);
    }, mapError: mapRpcError);
  }

  @override
  Future<Result<void>> submitAnswer({required String roundId, required int selectedOption}) {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<Map<String, dynamic>>(
        'submit_answer',
        params: {'p_round_id': roundId, 'p_selected_option': selectedOption},
      );
    }, mapError: mapRpcError);
  }

  @override
  Future<Result<void>> revealRound(String roundId) {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<Map<String, dynamic>>(
        'reveal_round',
        params: {'p_round_id': roundId},
      );
    }, mapError: mapRpcError);
  }

  @override
  Future<Result<void>> advanceGame(String gameId) {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<Map<String, dynamic>>(
        'advance_game',
        params: {'p_game_id': gameId},
      );
    }, mapError: mapRpcError);
  }

  @override
  Future<Result<int?>> getMyGameTokenReward({required String gameId, required String userId}) {
    return guardRepositoryCall(_networkInfo, () async {
      final List<Map<String, dynamic>> rows = await _client
          .from('token_transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('game_id', gameId)
          .eq('type', 'game_reward')
          .limit(1);
      return rows.isEmpty ? null : rows.first['amount'] as int;
    }, mapError: mapRpcError);
  }
}
