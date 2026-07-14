import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/error/failure.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../../animals/presentation/controllers/animals_controller.dart';
import '../../../profile/presentation/controllers/profile_controller.dart';
import '../../data/repositories/supabase_shop_repository.dart';
import '../../domain/repositories/shop_repository.dart';

final Provider<ShopRepository> shopRepositoryProvider = Provider<ShopRepository>((ref) {
  return SupabaseShopRepository(ref.watch(supabaseClientProvider), ref.watch(networkInfoProvider));
});

/// Drives a single purchase. Success invalidates both the unlocked-animal
/// set (so the shop/animal-select grids show the new animal immediately)
/// and the profile (so the token balance shown on the home screen updates
/// too) — simpler than wiring a realtime subscription for something that
/// only ever changes because of an action this same client just took.
class ShopController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<bool> unlock(String animalId) async {
    await future;
    state = const AsyncLoading();

    final result = await ref.read(shopRepositoryProvider).unlockAnimal(animalId);
    return result.when(
      success: (_) {
        ref.invalidate(unlockedAnimalIdsProvider);
        ref.invalidate(profileControllerProvider);
        state = const AsyncData(null);
        return true;
      },
      failure: (Failure failure) {
        state = AsyncError(failure, StackTrace.current);
        return false;
      },
    );
  }
}

final AsyncNotifierProvider<ShopController, void> shopControllerProvider =
    AsyncNotifierProvider<ShopController, void>(ShopController.new);
