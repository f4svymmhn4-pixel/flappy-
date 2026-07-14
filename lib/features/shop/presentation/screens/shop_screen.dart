import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../../animals/domain/entities/animal.dart';
import '../../../animals/presentation/controllers/animals_controller.dart';
import '../../../profile/domain/entities/profile.dart';
import '../../../profile/presentation/controllers/profile_controller.dart';
import '../controllers/shop_controller.dart';
import '../widgets/rarity_style.dart';
import '../widgets/shop_animal_card.dart';

class ShopScreen extends ConsumerWidget {
  const ShopScreen({super.key});

  Future<void> _onTapAnimal(
    BuildContext context,
    WidgetRef ref,
    Animal animal,
    bool isUnlocked,
    int tokens,
  ) async {
    if (isUnlocked) {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(animal.name),
          content: Text('${rarityLabel(animal.rarity)} · débloqué'),
          actions: [
            TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Fermer')),
          ],
        ),
      );
      return;
    }

    final bool? confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(animal.name),
        content: Text(
          '${rarityLabel(animal.rarity)}\nCoût : ${animal.unlockCost} jetons\nSolde : $tokens jetons',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: tokens >= animal.unlockCost ? () => Navigator.of(context).pop(true) : null,
            child: const Text('Débloquer'),
          ),
        ],
      ),
    );

    if (confirmed != true || !context.mounted) return;

    final bool success = await ref.read(shopControllerProvider.notifier).unlock(animal.id);
    if (!context.mounted) return;

    final AsyncValue<void> shopState = ref.read(shopControllerProvider);
    final String message = success
        ? '${animal.name} débloqué !'
        : (shopState.error is Failure
            ? (shopState.error! as Failure).message
            : 'Une erreur est survenue.');

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<List<Animal>> catalogState = ref.watch(animalCatalogProvider);
    final AsyncValue<Set<String>> unlockedState = ref.watch(unlockedAnimalIdsProvider);
    final AsyncValue<Profile> profileState = ref.watch(profileControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Boutique'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            child: Center(
              child: profileState.maybeWhen(
                data: (profile) => Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.circle, size: 10, color: AppColors.secondary),
                    const SizedBox(width: AppSpacing.xs),
                    Text('${profile.tokens}', style: AppTextStyles.bodyStrong),
                  ],
                ),
                orElse: () => const SizedBox.shrink(),
              ),
            ),
          ),
        ],
      ),
      body: catalogState.when(
        data: (catalog) => unlockedState.when(
          data: (unlocked) {
            final int tokens = profileState.value?.tokens ?? 0;
            return GridView.builder(
              padding: const EdgeInsets.all(AppSpacing.lg),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.85,
              ),
              itemCount: catalog.length,
              itemBuilder: (context, index) {
                final Animal animal = catalog[index];
                final bool isUnlocked = unlocked.contains(animal.id);
                return ShopAnimalCard(
                  animal: animal,
                  isUnlocked: isUnlocked,
                  onTap: () => _onTapAnimal(context, ref, animal, isUnlocked, tokens),
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
        ),
      ),
    );
  }
}
