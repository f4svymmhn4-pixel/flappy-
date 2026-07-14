import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../../animals/domain/entities/animal.dart';
import '../../../animals/presentation/controllers/animals_controller.dart';
import '../controllers/play_setup_controller.dart';

class AnimalSelectScreen extends ConsumerWidget {
  const AnimalSelectScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<List<Animal>> animalsState = ref.watch(unlockedAnimalsProvider);
    final String? selectedId = ref.watch(playSetupControllerProvider).animalId;

    return Scaffold(
      appBar: AppBar(title: const Text('Choisis ton animal')),
      body: animalsState.when(
        data: (animals) => _AnimalGrid(animals: animals, selectedId: selectedId),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: ElevatedButton(
            onPressed: selectedId == null
                ? null
                : () => context.push(RoutePaths.lobby),
            child: const Text('Confirmer'),
          ),
        ),
      ),
    );
  }
}

class _AnimalGrid extends ConsumerWidget {
  const _AnimalGrid({required this.animals, required this.selectedId});

  final List<Animal> animals;
  final String? selectedId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (animals.isEmpty) {
      return const Center(child: Text('Aucun animal débloqué.'));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(AppSpacing.lg),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: AppSpacing.md,
        crossAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.85,
      ),
      itemCount: animals.length,
      itemBuilder: (context, index) {
        final Animal animal = animals[index];
        final bool isSelected = animal.id == selectedId;
        return _AnimalTile(
          animal: animal,
          isSelected: isSelected,
          onTap: () => ref.read(playSetupControllerProvider.notifier).selectAnimal(animal.id),
        );
      },
    );
  }
}

class _AnimalTile extends StatelessWidget {
  const _AnimalTile({required this.animal, required this.isSelected, required this.onTap});

  final Animal animal;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? AppColors.primary.withValues(alpha: 0.15) : Colors.transparent,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
              color: isSelected ? AppColors.primary : Colors.grey.withValues(alpha: 0.25),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.pets_rounded, size: 32),
              const SizedBox(height: AppSpacing.xs),
              Text(
                animal.name,
                style: AppTextStyles.caption,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
