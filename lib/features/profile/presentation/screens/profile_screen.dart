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
import '../../domain/entities/profile.dart';
import '../controllers/profile_controller.dart';
import '../widgets/stat_tile.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  Future<void> _pickFavoriteAnimal(BuildContext context, WidgetRef ref) async {
    final List<Animal> unlocked = await ref.read(unlockedAnimalsProvider.future);
    if (!context.mounted) return;

    final String? chosen = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Wrap(
            spacing: AppSpacing.md,
            runSpacing: AppSpacing.md,
            children: [
              for (final animal in unlocked)
                ActionChip(
                  avatar: const Icon(Icons.pets_rounded, size: 18),
                  label: Text(animal.name),
                  onPressed: () => Navigator.of(context).pop(animal.id),
                ),
            ],
          ),
        ),
      ),
    );

    if (chosen == null) return;

    final Failure? failure = await ref
        .read(profileControllerProvider.notifier)
        .setFavoriteAnimal(chosen);
    if (!context.mounted || failure == null) return;

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(failure.message)));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<Profile> profileState = ref.watch(profileControllerProvider);
    final AsyncValue<Set<String>> unlockedIdsState = ref.watch(unlockedAnimalIdsProvider);
    final AsyncValue<List<Animal>> catalogState = ref.watch(animalCatalogProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: profileState.when(
        data: (profile) {
          final int unlockedCount = unlockedIdsState.value?.length ?? 0;
          final int catalogSize = catalogState.value?.length ?? 50;
          final String favoriteName = _favoriteAnimalName(profile, catalogState.value);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(profile.pseudo ?? '', style: AppTextStyles.displayLarge, textAlign: TextAlign.center),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Niveau ${profile.level}',
                  style: AppTextStyles.body,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.lg),
                Material(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    onTap: () => _pickFavoriteAnimal(context, ref),
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(
                        children: [
                          const Icon(Icons.pets_rounded, color: AppColors.primary),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Animal favori', style: AppTextStyles.caption),
                                Text(favoriteName, style: AppTextStyles.bodyStrong),
                              ],
                            ),
                          ),
                          const Icon(Icons.chevron_right_rounded),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: AppSpacing.md,
                  crossAxisSpacing: AppSpacing.md,
                  childAspectRatio: 1.5,
                  children: [
                    StatTile(
                      label: 'Parties jouées',
                      value: '${profile.gamesPlayed}',
                      icon: Icons.sports_esports_rounded,
                    ),
                    StatTile(
                      label: 'Victoires',
                      value: '${profile.gamesWon}',
                      icon: Icons.emoji_events_rounded,
                    ),
                    StatTile(
                      label: 'Taux de victoire',
                      value: '${(profile.winRate * 100).round()} %',
                      icon: Icons.percent_rounded,
                    ),
                    StatTile(
                      label: 'Précision',
                      value: '${(profile.accuracy * 100).round()} %',
                      icon: Icons.gps_fixed_rounded,
                    ),
                    StatTile(
                      label: 'Temps de réponse moyen',
                      value: '${(profile.avgResponseTimeMs / 1000).toStringAsFixed(1)} s',
                      icon: Icons.timer_rounded,
                    ),
                    StatTile(
                      label: 'Jetons',
                      value: '${profile.tokens}',
                      icon: Icons.circle,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),
                OutlinedButton.icon(
                  onPressed: () => context.push(RoutePaths.shop),
                  icon: const Icon(Icons.storefront_rounded),
                  label: Text('$unlockedCount / $catalogSize animaux débloqués'),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
        ),
      ),
    );
  }

  String _favoriteAnimalName(Profile profile, List<Animal>? catalog) {
    if (profile.avatarAnimalId == null || catalog == null) return 'Aucun';
    for (final animal in catalog) {
      if (animal.id == profile.avatarAnimalId) return animal.name;
    }
    return 'Aucun';
  }
}
