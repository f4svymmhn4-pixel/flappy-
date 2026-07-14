import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/result.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/repository_guard.dart';
import '../../domain/repositories/auth_repository.dart';

class SupabaseAuthRepository implements AuthRepository {
  SupabaseAuthRepository(this._client, this._networkInfo);

  final SupabaseClient _client;
  final NetworkInfo _networkInfo;

  @override
  String? get currentUserId => _client.auth.currentUser?.id;

  @override
  Stream<String?> get userIdChanges =>
      _client.auth.onAuthStateChange.map((state) => state.session?.user.id);

  @override
  Future<Result<String>> ensureSignedIn() {
    return guardRepositoryCall(_networkInfo, () async {
      final String? existing = currentUserId;
      if (existing != null) return existing;

      final AuthResponse response = await _client.auth.signInAnonymously();
      final String? userId = response.user?.id;
      if (userId == null) {
        throw const AuthException('Anonymous sign-in returned no user.');
      }
      return userId;
    });
  }
}
