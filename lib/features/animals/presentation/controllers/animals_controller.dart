import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/repositories/supabase_animal_repository.dart';
import '../../domain/entities/animal.dart';
import '../../domain/repositories/animal_repository.dart';

final Provider<AnimalRepository> animalRepositoryProvider = Provider<AnimalRepository>((ref) {
  return SupabaseAnimalRepository(
    ref.watch(supabaseClientProvider),
    ref.watch(networkInfoProvider),
  );
});

/// The full 50-animal catalog, locked and unlocked alike (used by the shop).
final FutureProvider<List<Animal>> animalCatalogProvider = FutureProvider<List<Animal>>((
  ref,
) async {
  final result = await ref.watch(animalRepositoryProvider).getCatalog();
  return result.when(success: (animals) => animals, failure: (failure) => throw failure);
});

final FutureProvider<Set<String>> unlockedAnimalIdsProvider = FutureProvider<Set<String>>((
  ref,
) async {
  final String userId = await ref.watch(currentUserIdProvider.future);
  final result = await ref.watch(animalRepositoryProvider).getUnlockedAnimalIds(userId);
  return result.when(success: (ids) => ids, failure: (failure) => throw failure);
});

/// The subset of the catalog this player can actually pick to play with —
/// what the animal-selection screen shows.
final FutureProvider<List<Animal>> unlockedAnimalsProvider = FutureProvider<List<Animal>>((
  ref,
) async {
  final List<Animal> catalog = await ref.watch(animalCatalogProvider.future);
  final Set<String> unlockedIds = await ref.watch(unlockedAnimalIdsProvider.future);
  return catalog.where((animal) => unlockedIds.contains(animal.id)).toList(growable: false);
});
