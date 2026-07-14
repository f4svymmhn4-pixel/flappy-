import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../data/repositories/supabase_auth_repository.dart';
import '../../domain/repositories/auth_repository.dart';

final Provider<AuthRepository> authRepositoryProvider = Provider<AuthRepository>((ref) {
  return SupabaseAuthRepository(
    ref.watch(supabaseClientProvider),
    ref.watch(networkInfoProvider),
  );
});

/// Resolves to the signed-in user id, creating an anonymous session on
/// first launch if none exists yet. Every screen that needs "am I signed
/// in" watches this instead of touching [AuthRepository] directly.
final FutureProvider<String> currentUserIdProvider = FutureProvider<String>((ref) async {
  final AuthRepository repository = ref.watch(authRepositoryProvider);

  final String? existing = repository.currentUserId;
  if (existing != null) return existing;

  final result = await repository.ensureSignedIn();
  return result.when(
    success: (userId) => userId,
    failure: (failure) => throw AuthException(failure.message),
  );
});
