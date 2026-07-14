import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../animals/domain/entities/animal.dart';
import 'rarity_style.dart';

class ShopAnimalCard extends StatelessWidget {
  const ShopAnimalCard({required this.animal, required this.isUnlocked, required this.onTap, super.key});

  final Animal animal;
  final bool isUnlocked;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final Color accent = rarityColor(animal.rarity);

    return Material(
      color: isUnlocked ? accent.withValues(alpha: 0.12) : Colors.grey.withValues(alpha: 0.06),
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  Icon(
                    Icons.pets_rounded,
                    size: 32,
                    color: isUnlocked ? accent : Colors.grey,
                  ),
                  if (!isUnlocked)
                    const Positioned(
                      bottom: -4,
                      right: -4,
                      child: Icon(Icons.lock_rounded, size: 16, color: Colors.grey),
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                animal.name,
                style: AppTextStyles.caption,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              if (isUnlocked)
                Text(
                  rarityLabel(animal.rarity),
                  style: AppTextStyles.caption.copyWith(color: accent),
                )
              else
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.circle, size: 8, color: AppColors.secondary),
                    const SizedBox(width: 2),
                    Text('${animal.unlockCost}', style: AppTextStyles.caption),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
