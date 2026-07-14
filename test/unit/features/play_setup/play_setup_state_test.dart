import 'package:betiz/features/game/domain/entities/difficulty.dart';
import 'package:betiz/features/play_setup/domain/play_mode.dart';
import 'package:betiz/features/play_setup/presentation/controllers/play_setup_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

ProviderContainer _container() => ProviderContainer();

void main() {
  group('PlaySetupState.needsDifficulty', () {
    test('is false for joinPrivate (the host already set one)', () {
      const state = PlaySetupState(mode: PlayMode.joinPrivate);
      expect(state.needsDifficulty, isFalse);
    });

    test('is true for every other mode', () {
      for (final mode in [PlayMode.quickMatch, PlayMode.createPrivate, PlayMode.solo]) {
        expect(PlaySetupState(mode: mode).needsDifficulty, isTrue, reason: mode.toString());
      }
    });

    test('is false before a mode is chosen', () {
      expect(const PlaySetupState().needsDifficulty, isFalse);
    });
  });

  group('PlaySetupState.isReadyToExecute', () {
    test('quickMatch needs a difficulty and an animal', () {
      const withBoth = PlaySetupState(
        mode: PlayMode.quickMatch,
        difficulty: Difficulty.easy,
        animalId: 'animal-1',
      );
      const missingDifficulty = PlaySetupState(mode: PlayMode.quickMatch, animalId: 'animal-1');

      expect(withBoth.isReadyToExecute, isTrue);
      expect(missingDifficulty.isReadyToExecute, isFalse);
    });

    test('joinPrivate needs a non-empty room code and an animal, not a difficulty', () {
      const ready = PlaySetupState(
        mode: PlayMode.joinPrivate,
        animalId: 'animal-1',
        roomCode: 'ABC123',
      );
      const missingCode = PlaySetupState(mode: PlayMode.joinPrivate, animalId: 'animal-1');

      expect(ready.isReadyToExecute, isTrue);
      expect(missingCode.isReadyToExecute, isFalse);
    });

    test('is never ready before a mode is chosen', () {
      expect(const PlaySetupState(animalId: 'animal-1').isReadyToExecute, isFalse);
    });
  });

  group('PlaySetupController', () {
    test('selectMode resets any earlier difficulty/animal/roomCode choice', () {
      final container = _container();
      addTearDown(container.dispose);
      final notifier = container.read(playSetupControllerProvider.notifier);

      notifier
        ..selectMode(PlayMode.quickMatch)
        ..selectDifficulty(Difficulty.hard)
        ..selectAnimal('animal-1');
      expect(container.read(playSetupControllerProvider).isReadyToExecute, isTrue);

      notifier.selectMode(PlayMode.joinPrivate);
      final state = container.read(playSetupControllerProvider);

      expect(state.difficulty, isNull);
      expect(state.animalId, isNull);
      expect(state.isReadyToExecute, isFalse);
    });

    test('setRoomCode upper-cases the input', () {
      final container = _container();
      addTearDown(container.dispose);

      container.read(playSetupControllerProvider.notifier).setRoomCode('ab12cd');

      expect(container.read(playSetupControllerProvider).roomCode, 'AB12CD');
    });
  });
}
