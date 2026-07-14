import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../animals/domain/entities/animal.dart';

/// Central place mapping [AnimalRarity] to its display color/label —
/// every widget that renders a rarity badge (shop grid, animal-select
/// grid, profile) should go through this instead of re-declaring the
/// mapping.
Color rarityColor(AnimalRarity rarity) {
  return switch (rarity) {
    AnimalRarity.common => AppColors.rarityCommon,
    AnimalRarity.rare => AppColors.rarityRare,
    AnimalRarity.epic => AppColors.rarityEpic,
    AnimalRarity.legendary => AppColors.rarityLegendary,
  };
}

String rarityLabel(AnimalRarity rarity) {
  return switch (rarity) {
    AnimalRarity.common => 'Commun',
    AnimalRarity.rare => 'Rare',
    AnimalRarity.epic => 'Épique',
    AnimalRarity.legendary => 'Légendaire',
  };
}
