import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/repositories/supabase_game_lifecycle_repository.dart';
import '../../domain/repositories/game_lifecycle_repository.dart';

final Provider<GameLifecycleRepository> gameLifecycleRepositoryProvider =
    Provider<GameLifecycleRepository>((ref) {
  return SupabaseGameLifecycleRepository(
    ref.watch(supabaseClientProvider),
    ref.watch(networkInfoProvider),
  );
});

/// Non-null if the signed-in player still has an `in_progress` game to
/// return to — checked once when the home screen loads (see
/// GameLifecycleRepository.findResumableGame for why "reconnexion" needs
/// this instead of just relying on realtime, which only pushes changes
/// that happen *after* a client subscribes).
final FutureProvider<String?> resumableGameProvider = FutureProvider<String?>((ref) async {
  final String userId = await ref.watch(currentUserIdProvider.future);
  final result = await ref.watch(gameLifecycleRepositoryProvider).findResumableGame(userId);
  return result.when(success: (gameId) => gameId, failure: (failure) => throw failure);
});
