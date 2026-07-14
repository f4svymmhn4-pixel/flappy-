import 'package:equatable/equatable.dart';

enum AnimalRarity { common, rare, epic, legendary }

AnimalRarity animalRarityFromString(String value) {
  return AnimalRarity.values.firstWhere(
    (rarity) => rarity.name == value,
    orElse: () => AnimalRarity.common,
  );
}

class Animal extends Equatable {
  const Animal({
    required this.id,
    required this.slug,
    required this.name,
    required this.rarity,
    required this.unlockCost,
    required this.isStarter,
    required this.sortOrder,
    this.assetIdleUrl,
  });

  final String id;
  final String slug;
  final String name;
  final AnimalRarity rarity;
  final int unlockCost;
  final bool isStarter;
  final int sortOrder;
  final String? assetIdleUrl;

  @override
  List<Object?> get props => [id, slug, name, rarity, unlockCost, isStarter, sortOrder];
}
