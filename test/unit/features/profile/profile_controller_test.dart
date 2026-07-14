import 'package:betiz/core/error/failure.dart';
import 'package:betiz/core/error/result.dart';
import 'package:betiz/features/auth/presentation/controllers/auth_controller.dart';
import 'package:betiz/features/profile/domain/entities/profile.dart';
import 'package:betiz/features/profile/domain/repositories/profile_repository.dart';
import 'package:betiz/features/profile/presentation/controllers/profile_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockProfileRepository extends Mock implements ProfileRepository {}

const Profile _initialProfile = Profile(
  id: 'user-1',
  pseudo: 'Renard',
  avatarAnimalId: null,
  tokens: 100,
  xp: 0,
  level: 1,
  gamesPlayed: 0,
  gamesWon: 0,
  totalCorrectAnswers: 0,
  totalAnswers: 0,
  avgResponseTimeMs: 0,
);

void main() {
  late MockProfileRepository repository;
  late ProviderContainer container;

  setUp(() {
    repository = MockProfileRepository();
    when(() => repository.getProfile('user-1')).thenAnswer(
      (_) async => const Result.success(_initialProfile),
    );

    container = ProviderContainer(
      overrides: [
        currentUserIdProvider.overrideWith((ref) async => 'user-1'),
        profileRepositoryProvider.overrideWithValue(repository),
      ],
    );
  });

  tearDown(() => container.dispose());

  test('claimPseudo updates the cached profile on success', () async {
    const updated = Profile(
      id: 'user-1',
      pseudo: 'RenardRoux',
      avatarAnimalId: null,
      tokens: 100,
      xp: 0,
      level: 1,
      gamesPlayed: 0,
      gamesWon: 0,
      totalCorrectAnswers: 0,
      totalAnswers: 0,
      avgResponseTimeMs: 0,
    );
    when(() => repository.claimPseudo('user-1', 'RenardRoux')).thenAnswer(
      (_) async => const Result.success(updated),
    );

    final Failure? failure = await container
        .read(profileControllerProvider.notifier)
        .claimPseudo('RenardRoux');

    expect(failure, isNull);
    expect(container.read(profileControllerProvider).value?.pseudo, 'RenardRoux');
  });

  test('claimPseudo returns the failure and leaves the cached profile untouched', () async {
    when(() => repository.claimPseudo('user-1', 'Renard')).thenAnswer(
      (_) async => const Result.failure(ValidationFailure('Cette valeur est déjà utilisée.')),
    );

    final Failure? failure = await container
        .read(profileControllerProvider.notifier)
        .claimPseudo('Renard');

    expect(failure, isA<ValidationFailure>());
    expect(container.read(profileControllerProvider).value?.pseudo, 'Renard');
  });

  test('setFavoriteAnimal updates the cached profile on success', () async {
    const updated = Profile(
      id: 'user-1',
      pseudo: 'Renard',
      avatarAnimalId: 'animal-1',
      tokens: 100,
      xp: 0,
      level: 1,
      gamesPlayed: 0,
      gamesWon: 0,
      totalCorrectAnswers: 0,
      totalAnswers: 0,
      avgResponseTimeMs: 0,
    );
    when(() => repository.setFavoriteAnimal('user-1', 'animal-1')).thenAnswer(
      (_) async => const Result.success(updated),
    );

    final Failure? failure = await container
        .read(profileControllerProvider.notifier)
        .setFavoriteAnimal('animal-1');

    expect(failure, isNull);
    expect(container.read(profileControllerProvider).value?.avatarAnimalId, 'animal-1');
  });
}
