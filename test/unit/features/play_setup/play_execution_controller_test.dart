import 'package:betiz/core/error/failure.dart';
import 'package:betiz/core/error/result.dart';
import 'package:betiz/features/game/domain/entities/difficulty.dart';
import 'package:betiz/features/game/domain/repositories/game_lifecycle_repository.dart';
import 'package:betiz/features/game/presentation/controllers/game_lifecycle_controller.dart';
import 'package:betiz/features/play_setup/domain/play_mode.dart';
import 'package:betiz/features/play_setup/presentation/controllers/play_execution_controller.dart';
import 'package:betiz/features/play_setup/presentation/controllers/play_setup_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockGameLifecycleRepository extends Mock implements GameLifecycleRepository {}

void main() {
  late MockGameLifecycleRepository repository;
  late ProviderContainer container;

  setUp(() {
    repository = MockGameLifecycleRepository();
    container = ProviderContainer(
      overrides: [gameLifecycleRepositoryProvider.overrideWithValue(repository)],
    );
  });

  tearDown(() => container.dispose());

  test('createPrivate calls createPrivateGame and yields PlayOutcomeLobby', () async {
    when(
      () => repository.createPrivateGame(difficulty: Difficulty.easy, animalId: 'animal-1'),
    ).thenAnswer((_) async => const Result.success((gameId: 'game-1', roomCode: 'ABC123')));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.createPrivate)
      ..selectDifficulty(Difficulty.easy)
      ..selectAnimal('animal-1');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isA<PlayOutcomeLobby>());
    expect((outcome! as PlayOutcomeLobby).gameId, 'game-1');
  });

  test('joinPrivate calls joinPrivateGame with the typed room code', () async {
    when(
      () => repository.joinPrivateGame(roomCode: 'ZK3P9Q', animalId: 'animal-2'),
    ).thenAnswer((_) async => const Result.success('game-2'));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.joinPrivate)
      ..setRoomCode('zk3p9q')
      ..selectAnimal('animal-2');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isA<PlayOutcomeLobby>());
    expect((outcome! as PlayOutcomeLobby).gameId, 'game-2');
    verify(() => repository.joinPrivateGame(roomCode: 'ZK3P9Q', animalId: 'animal-2')).called(1);
  });

  test('quickMatch that immediately matches yields PlayOutcomeGameStarted', () async {
    when(
      () => repository.joinMatchmaking(difficulty: Difficulty.hard, animalId: 'animal-3'),
    ).thenAnswer((_) async => const Result.success((matched: true, gameId: 'game-3')));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.quickMatch)
      ..selectDifficulty(Difficulty.hard)
      ..selectAnimal('animal-3');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isA<PlayOutcomeGameStarted>());
    expect((outcome! as PlayOutcomeGameStarted).gameId, 'game-3');
  });

  test('quickMatch that has to wait yields PlayOutcomeQueued', () async {
    when(
      () => repository.joinMatchmaking(difficulty: Difficulty.medium, animalId: 'animal-4'),
    ).thenAnswer((_) async => const Result.success((matched: false, gameId: null)));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.quickMatch)
      ..selectDifficulty(Difficulty.medium)
      ..selectAnimal('animal-4');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isA<PlayOutcomeQueued>());
  });

  test('solo calls startSoloGame and yields PlayOutcomeGameStarted', () async {
    when(
      () => repository.startSoloGame(difficulty: Difficulty.easy, animalId: 'animal-5'),
    ).thenAnswer((_) async => const Result.success('game-5'));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.solo)
      ..selectDifficulty(Difficulty.easy)
      ..selectAnimal('animal-5');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isA<PlayOutcomeGameStarted>());
  });

  test('an incomplete setup never calls the repository and surfaces a ValidationFailure', () async {
    container.read(playSetupControllerProvider.notifier).selectMode(PlayMode.quickMatch);

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isNull);
    verifyZeroInteractions(repository);
    final state = container.read(playExecutionControllerProvider);
    expect(state.error, isA<ValidationFailure>());
  });

  test('a repository failure surfaces through state and returns null', () async {
    when(
      () => repository.createPrivateGame(difficulty: Difficulty.easy, animalId: 'animal-1'),
    ).thenAnswer((_) async => const Result.failure(ValidationFailure('game_full')));

    container.read(playSetupControllerProvider.notifier)
      ..selectMode(PlayMode.createPrivate)
      ..selectDifficulty(Difficulty.easy)
      ..selectAnimal('animal-1');

    final outcome = await container.read(playExecutionControllerProvider.notifier).execute();

    expect(outcome, isNull);
    final state = container.read(playExecutionControllerProvider);
    expect(state.hasError, isTrue);
  });
}
