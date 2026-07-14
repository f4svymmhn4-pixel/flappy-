import 'package:betiz/features/animals/data/models/animal_model.dart';
import 'package:betiz/features/animals/domain/entities/animal.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AnimalModel.fromJson', () {
    test('parses a starter animal', () {
      final animal = AnimalModel.fromJson({
        'id': 'animal-1',
        'slug': 'renard',
        'name': 'Renard',
        'rarity': 'common',
        'unlock_cost': 0,
        'is_starter': true,
        'sort_order': 0,
        'asset_idle_url': null,
      });

      expect(animal.slug, 'renard');
      expect(animal.rarity, AnimalRarity.common);
      expect(animal.isStarter, isTrue);
      expect(animal.unlockCost, 0);
    });

    test('parses a legendary animal with an asset url', () {
      final animal = AnimalModel.fromJson({
        'id': 'animal-50',
        'slug': 'narval',
        'name': 'Narval',
        'rarity': 'legendary',
        'unlock_cost': 25000,
        'is_starter': false,
        'sort_order': 49,
        'asset_idle_url': 'https://cdn.example/narval_idle.png',
      });

      expect(animal.rarity, AnimalRarity.legendary);
      expect(animal.unlockCost, 25000);
      expect(animal.assetIdleUrl, 'https://cdn.example/narval_idle.png');
    });

    test('an unrecognized rarity string falls back to common', () {
      expect(animalRarityFromString('mythic'), AnimalRarity.common);
    });
  });
}
