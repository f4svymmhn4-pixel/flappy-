import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_spacing.dart';
import '../../../../core/error/failure.dart';
import '../../domain/entities/game.dart';
import '../../domain/entities/game_round.dart';
import '../../domain/entities/game_status.dart';
import '../controllers/game_realtime_controller.dart';
import 'end_of_game_screen.dart';
import 'round_view.dart';

class GameScreen extends ConsumerWidget {
  const GameScreen({required this.gameId, super.key});

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<Game?> gameState = ref.watch(gameStreamProvider(gameId));

    return Scaffold(
      body: SafeArea(
        child: gameState.when(
          data: (game) {
            if (game == null) {
              return const Center(child: Text("Cette partie n'existe plus."));
            }
            return switch (game.status) {
              GameStatus.finished => EndOfGameScreen(gameId: gameId),
              GameStatus.aborted => const Center(child: Text('La partie a été annulée.')),
              GameStatus.waiting => const Center(child: CircularProgressIndicator()),
              GameStatus.inProgress => _RoundHost(gameId: gameId, game: game),
            };
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Text(
                error is Failure ? error.message : 'Une erreur est survenue.',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoundHost extends ConsumerWidget {
  const _RoundHost({required this.gameId, required this.game});

  final String gameId;
  final Game game;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<GameRound?> roundState = ref.watch(currentRoundProvider(gameId));

    return roundState.when(
      data: (round) => round == null
          ? const Center(child: Text('La partie va commencer...'))
          : RoundView(
              key: ValueKey(round.id),
              gameId: gameId,
              round: round,
              roundDurationSeconds: game.roundDurationSeconds,
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
      ),
    );
  }
}
