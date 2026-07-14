import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../game/domain/entities/difficulty.dart';
import '../../domain/play_mode.dart';

class PlaySetupState extends Equatable {
  const PlaySetupState({this.mode, this.difficulty, this.animalId, this.roomCode});

  final PlayMode? mode;
  final Difficulty? difficulty;
  final String? animalId;

  /// Only meaningful for [PlayMode.joinPrivate]: the code the player typed
  /// in on the join-by-code screen, before the host's difficulty is known.
  final String? roomCode;

  /// [PlayMode.joinPrivate] doesn't need a difficulty choice — the private
  /// game already has one, set by its host.
  bool get needsDifficulty => mode != null && mode != PlayMode.joinPrivate;

  bool get isReadyToExecute {
    if (mode == null || animalId == null) return false;
    if (mode == PlayMode.joinPrivate) return roomCode != null && roomCode!.isNotEmpty;
    return difficulty != null;
  }

  PlaySetupState copyWith({PlayMode? mode, Difficulty? difficulty, String? animalId, String? roomCode}) {
    return PlaySetupState(
      mode: mode ?? this.mode,
      difficulty: difficulty ?? this.difficulty,
      animalId: animalId ?? this.animalId,
      roomCode: roomCode ?? this.roomCode,
    );
  }

  @override
  List<Object?> get props => [mode, difficulty, animalId, roomCode];
}

/// Holds the in-progress "set up a match" choices (mode, then difficulty,
/// then animal, and a room code for the join-by-code flow) as the player
/// moves through the play_setup screens, before
/// [PlayExecutionController] consumes them to actually create/join a game.
class PlaySetupController extends Notifier<PlaySetupState> {
  @override
  PlaySetupState build() => const PlaySetupState();

  void selectMode(PlayMode mode) {
    state = PlaySetupState(mode: mode);
  }

  void selectDifficulty(Difficulty difficulty) {
    state = state.copyWith(difficulty: difficulty);
  }

  void selectAnimal(String animalId) {
    state = state.copyWith(animalId: animalId);
  }

  void setRoomCode(String roomCode) {
    state = state.copyWith(roomCode: roomCode.toUpperCase());
  }

  void reset() {
    state = const PlaySetupState();
  }
}

final NotifierProvider<PlaySetupController, PlaySetupState> playSetupControllerProvider =
    NotifierProvider<PlaySetupController, PlaySetupState>(PlaySetupController.new);
