import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../domain/entities/animal.dart';
import '../../domain/repositories/animal_repository.dart';
import '../models/animal_model.dart';

class SupabaseAnimalRepository implements AnimalRepository {
  SupabaseAnimalRepository(this._client, this._networkInfo);

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  Future<Result<List<Animal>>> getCatalog() {
    return guardRepositoryCall(_networkInfo, () async {
      final List<Map<String, dynamic>> rows =
          await _client.from('animals').select().order('sort_order');
      return rows.map(AnimalModel.fromJson).toList(growable: false);
    });
  }

  @override
  Future<Result<Set<String>>> getUnlockedAnimalIds(String userId) {
    return guardRepositoryCall(_networkInfo, () async {
      final List<Map<String, dynamic>> rows =
          await _client.from('user_animals').select('animal_id').eq('user_id', userId);
      return rows.map((row) => row['animal_id'] as String).toSet();
    });
  }
}
