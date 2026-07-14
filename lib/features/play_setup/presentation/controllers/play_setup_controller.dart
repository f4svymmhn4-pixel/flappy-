import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../game/domain/entities/difficulty.dart';

class PlaySetupState extends Equatable {
  const PlaySetupState({this.difficulty, this.animalId});

  final Difficulty? difficulty;
  final String? animalId;

  bool get isReady => difficulty != null && animalId != null;

  PlaySetupState copyWith({Difficulty? difficulty, String? animalId}) {
    return PlaySetupState(
      difficulty: difficulty ?? this.difficulty,
      animalId: animalId ?? this.animalId,
    );
  }

  @override
  List<Object?> get props => [difficulty, animalId];
}

/// Holds the in-progress "set up a match" choices (difficulty, then
/// animal) as the player moves through the play_setup screens, before
/// matchmaking/private-lobby creation (added in the Matchmaking step)
/// consumes them.
class PlaySetupController extends Notifier<PlaySetupState> {
  @override
  PlaySetupState build() => const PlaySetupState();

  void selectDifficulty(Difficulty difficulty) {
    state = state.copyWith(difficulty: difficulty);
  }

  void selectAnimal(String animalId) {
    state = state.copyWith(animalId: animalId);
  }

  void reset() {
    state = const PlaySetupState();
  }
}

final NotifierProvider<PlaySetupController, PlaySetupState> playSetupControllerProvider =
    NotifierProvider<PlaySetupController, PlaySetupState>(PlaySetupController.new);
