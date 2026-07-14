import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/network_info.dart';
import '../../../../core/network/supabase_provider.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/repositories/supabase_gameplay_repository.dart';
import '../../domain/entities/round_question.dart';
import '../../domain/repositories/gameplay_repository.dart';

final Provider<GameplayRepository> gameplayRepositoryProvider = Provider<GameplayRepository>((
  ref,
) {
  return SupabaseGameplayRepository(ref.watch(supabaseClientProvider), ref.watch(networkInfoProvider));
});

/// The current round's question, refetched whenever [roundId] changes
/// (each round has a distinct id, so a fresh round means a fresh fetch —
/// no manual invalidation needed).
final AutoDisposeFutureProviderFamily<RoundQuestion, String> roundQuestionProvider =
    FutureProvider.autoDispose.family<RoundQuestion, String>((ref, roundId) async {
  final result = await ref.watch(gameplayRepositoryProvider).getRoundQuestion(roundId);
  return result.when(success: (question) => question, failure: (failure) => throw failure);
});

/// Tokens credited to the signed-in player for [gameId], once
/// `finish_game` has settled it — used on the end-of-game screen.
final AutoDisposeFutureProviderFamily<int?, String> myGameTokenRewardProvider = FutureProvider
    .autoDispose
    .family<int?, String>((ref, gameId) async {
      final String userId = await ref.watch(currentUserIdProvider.future);
      final result = await ref
          .watch(gameplayRepositoryProvider)
          .getMyGameTokenReward(gameId: gameId, userId: userId);
      return result.when(success: (amount) => amount, failure: (failure) => throw failure);
    });
