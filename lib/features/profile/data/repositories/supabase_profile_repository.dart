import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../domain/entities/profile.dart';
import '../../domain/repositories/profile_repository.dart';
import '../models/profile_model.dart';

class SupabaseProfileRepository implements ProfileRepository {
  SupabaseProfileRepository(this._client, this._networkInfo);

  static const String _table = 'profiles';

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  Future<Result<Profile>> getProfile(String userId) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> row =
          await _client.from(_table).select().eq('id', userId).single();
      return ProfileModel.fromJson(row);
    });
  }

  @override
  Future<Result<Profile>> claimPseudo(String userId, String pseudo) {
    return guardRepositoryCall(_networkInfo, () async {
      final Map<String, dynamic> row = await _client
          .from(_table)
          .update({'pseudo': pseudo})
          .eq('id', userId)
          .select()
          .single();
      return ProfileModel.fromJson(row);
    });
  }
}
