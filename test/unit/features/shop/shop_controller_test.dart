import 'package:betiz/core/error/failure.dart';
import 'package:betiz/core/error/result.dart';
import 'package:betiz/features/shop/domain/repositories/shop_repository.dart';
import 'package:betiz/features/shop/presentation/controllers/shop_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockShopRepository extends Mock implements ShopRepository {}

void main() {
  late MockShopRepository repository;
  late ProviderContainer container;

  setUp(() {
    repository = MockShopRepository();
    container = ProviderContainer(
      overrides: [shopRepositoryProvider.overrideWithValue(repository)],
    );
  });

  tearDown(() => container.dispose());

  test('a successful unlock returns true and leaves state clean', () async {
    when(() => repository.unlockAnimal('animal-1')).thenAnswer(
      (_) async => const Result.success(1100),
    );

    final bool success = await container.read(shopControllerProvider.notifier).unlock('animal-1');

    expect(success, isTrue);
    expect(container.read(shopControllerProvider).hasError, isFalse);
  });

  test('insufficient tokens surfaces as a failure and returns false', () async {
    when(() => repository.unlockAnimal('animal-2')).thenAnswer(
      (_) async => const Result.failure(ValidationFailure("Tu n'as pas assez de jetons.")),
    );

    final bool success = await container.read(shopControllerProvider.notifier).unlock('animal-2');

    expect(success, isFalse);
    final state = container.read(shopControllerProvider);
    expect(state.hasError, isTrue);
    expect((state.error! as Failure).message, "Tu n'as pas assez de jetons.");
  });
}
