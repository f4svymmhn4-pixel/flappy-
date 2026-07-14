import '../../domain/entities/animal.dart';

class AnimalModel extends Animal {
  const AnimalModel({
    required super.id,
    required super.slug,
    required super.name,
    required super.rarity,
    required super.unlockCost,
    required super.isStarter,
    required super.sortOrder,
    super.assetIdleUrl,
  });

  factory AnimalModel.fromJson(Map<String, dynamic> json) {
    return AnimalModel(
      id: json['id'] as String,
      slug: json['slug'] as String,
      name: json['name'] as String,
      rarity: animalRarityFromString(json['rarity'] as String),
      unlockCost: json['unlock_cost'] as int,
      isStarter: json['is_starter'] as bool,
      sortOrder: json['sort_order'] as int,
      assetIdleUrl: json['asset_idle_url'] as String?,
    );
  }
}
