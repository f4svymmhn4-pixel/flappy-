import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../../../core/network/rpc_error_mapper.dart';
import '../../domain/repositories/shop_repository.dart';

class SupabaseShopRepository implements ShopRepository {
  SupabaseShopRepository(this._client, this._networkInfo);

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  Future<Result<int>> unlockAnimal(String animalId) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> json = await _client.rpc(
        'unlock_animal',
        params: {'p_animal_id': animalId},
      );
      return json['tokens'] as int;
    }, mapError: mapRpcError);
  }
}
