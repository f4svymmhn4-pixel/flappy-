import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/error/failure.dart';
import '../../../profile/presentation/controllers/profile_controller.dart';
import '../../domain/pseudo_rules.dart';

/// Drives the pseudo-claim screen: validates locally, then delegates to
/// [ProfileController.claimPseudo] so the profile cache updates in the
/// same round-trip. Exposed as an [AsyncNotifier] purely to get a clean
/// loading/error state for the submit button — the claimed pseudo itself
/// lives on [profileControllerProvider].
class PseudoController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<bool> submit(String pseudo) async {
    final String? localError = validatePseudo(pseudo);
    if (localError != null) {
      state = AsyncError(ValidationFailure(localError), StackTrace.current);
      return false;
    }

    state = const AsyncLoading();
    final Failure? failure = await ref.read(profileControllerProvider.notifier).claimPseudo(
          pseudo,
        );

    if (failure != null) {
      state = AsyncError(failure, StackTrace.current);
      return false;
    }

    state = const AsyncData(null);
    return true;
  }
}

final AsyncNotifierProvider<PseudoController, void> pseudoControllerProvider =
    AsyncNotifierProvider<PseudoController, void>(PseudoController.new);
