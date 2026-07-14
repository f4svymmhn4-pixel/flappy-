import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../domain/entities/difficulty.dart';
import '../../domain/repositories/game_lifecycle_repository.dart';
import '../game_rpc_error_mapper.dart';

class SupabaseGameLifecycleRepository implements GameLifecycleRepository {
  SupabaseGameLifecycleRepository(this._client, this._networkInfo);

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  Future<Result<({String gameId, String roomCode})>> createPrivateGame({
    required Difficulty difficulty,
    required String animalId,
  }) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'create_private_game',
        params: {'p_difficulty': difficulty.wireValue, 'p_animal_id': animalId},
      );
      return (gameId: json['game_id'] as String, roomCode: json['room_code'] as String);
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<String>> joinPrivateGame({required String roomCode, required String animalId}) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'join_private_game',
        params: {'p_room_code': roomCode, 'p_animal_id': animalId},
      );
      return json['game_id'] as String;
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<void>> startPrivateGame(String gameId) {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<void>('start_private_game', params: {'p_game_id': gameId});
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<void>> leaveGame(String gameId) {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<void>('leave_game', params: {'p_game_id': gameId});
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<({bool matched, String? gameId})>> joinMatchmaking({
    required Difficulty difficulty,
    required String animalId,
  }) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'join_matchmaking',
        params: {'p_difficulty': difficulty.wireValue, 'p_animal_id': animalId},
      );
      return (matched: json['matched'] as bool, gameId: json['game_id'] as String?);
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<void>> leaveMatchmaking() {
    return guardRepositoryCall(_networkInfo, () async {
      await _client.rpc<void>('leave_matchmaking');
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<String>> startSoloGame({
    required Difficulty difficulty,
    required String animalId,
  }) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'start_solo_game',
        params: {'p_difficulty': difficulty.wireValue, 'p_animal_id': animalId},
      );
      return json['game_id'] as String;
    }, mapError: mapGameRpcError);
  }

  @override
  Future<Result<String?>> findResumableGame(String userId) {
    return guardRepositoryCall(_networkInfo, () async {
      final List<Map<String, dynamic>> rows = await _client
          .from('game_players')
          .select('game_id, games!inner(status)')
          .eq('user_id', userId)
          .eq('status', 'joined')
          .eq('games.status', 'in_progress')
          .limit(1);
      return rows.isEmpty ? null : rows.first['game_id'] as String;
    }, mapError: mapGameRpcError);
  }
}
