import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/error/failure.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/repositories/supabase_profile_repository.dart';
import '../../domain/entities/profile.dart';
import '../../domain/repositories/profile_repository.dart';

final Provider<ProfileRepository> profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return SupabaseProfileRepository(
    ref.watch(supabaseClientProvider),
    ref.watch(networkInfoProvider),
  );
});

/// Holds the signed-in player's profile. Fetches it as soon as
/// [currentUserIdProvider] resolves; [claimPseudo] both performs the
/// mutation and updates this state on success so the UI doesn't need a
/// separate refresh round-trip.
class ProfileController extends AsyncNotifier<Profile> {
  @override
  Future<Profile> build() async {
    final String userId = await ref.watch(currentUserIdProvider.future);
    final result = await ref.read(profileRepositoryProvider).getProfile(userId);
    return result.when(success: (profile) => profile, failure: (failure) => throw failure);
  }

  Future<Failure?> claimPseudo(String pseudo) async {
    final Profile current = await future;
    final result = await ref.read(profileRepositoryProvider).claimPseudo(current.id, pseudo);
    return result.when(
      success: (profile) {
        state = AsyncData(profile);
        return null;
      },
      failure: (failure) => failure,
    );
  }
}

final AsyncNotifierProvider<ProfileController, Profile> profileControllerProvider =
    AsyncNotifierProvider<ProfileController, Profile>(ProfileController.new);
