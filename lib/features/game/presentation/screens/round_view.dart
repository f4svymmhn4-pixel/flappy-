import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../domain/entities/game_answer.dart';
import '../../domain/entities/game_player.dart';
import '../../domain/entities/game_round.dart';
import '../../domain/entities/game_status.dart';
import '../controllers/game_realtime_controller.dart';
import '../controllers/gameplay_controller.dart';
import '../widgets/animal_arena.dart';
import '../widgets/ranking_list.dart';
import '../widgets/round_timer_bar.dart';

/// Owns one round's lifecycle: countdown -> submit -> reveal -> (a beat to
/// look at the result) -> advance. Keyed by round id from the parent so a
/// new round gets a fresh instance (and therefore fresh local state)
/// automatically instead of needing manual reset logic.
class RoundView extends ConsumerStatefulWidget {
  const RoundView({
    required this.gameId,
    required this.round,
    required this.roundDurationSeconds,
    super.key,
  });

  final String gameId;
  final GameRound round;
  final int roundDurationSeconds;

  @override
  ConsumerState<RoundView> createState() => _RoundViewState();
}

class _RoundViewState extends ConsumerState<RoundView> {
  Timer? _ticker;
  Duration _remaining = Duration.zero;
  int? _mySelection;
  bool _revealTriggered = false;
  bool _advanceTriggered = false;

  @override
  void initState() {
    super.initState();
    _remaining = widget.round.remaining();
    _ticker = Timer.periodic(const Duration(milliseconds: 200), (_) => _tick());
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  void _tick() {
    if (!mounted) return;
    final GameRound current = ref.read(currentRoundProvider(widget.gameId)).value ?? widget.round;
    final Duration remaining = current.remaining();
    setState(() => _remaining = remaining);

    if (remaining == Duration.zero &&
        !_revealTriggered &&
        current.status == RoundStatus.active) {
      _revealTriggered = true;
      // The server independently checks now() >= ends_at, so a client a
      // few hundred ms fast can have this rejected — reset the guard so
      // the next tick (200ms later) retries instead of stalling the round
      // forever for everyone whose clock happened to be ahead.
      ref.read(gameplayRepositoryProvider).revealRound(current.id).then((result) {
        if (result.isFailure && mounted) {
          _revealTriggered = false;
        }
      });
    }
  }

  Future<void> _selectAnswer(int index, RoundStatus status) async {
    if (status != RoundStatus.active) return;
    setState(() => _mySelection = index);
    await ref.read(
      gameplayRepositoryProvider,
    ).submitAnswer(roundId: widget.round.id, selectedOption: index);
  }

  void _scheduleAdvanceOnceRevealed() {
    if (_advanceTriggered) return;
    _advanceTriggered = true;
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (!mounted) return;
      ref.read(gameplayRepositoryProvider).advanceGame(widget.gameId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final GameRound round =
        ref.watch(currentRoundProvider(widget.gameId)).value ?? widget.round;

    ref.listen(currentRoundProvider(widget.gameId), (previous, next) {
      final RoundStatus? previousStatus = previous?.value?.status;
      final GameRound? nextRound = next.value;
      if (nextRound != null &&
          nextRound.status == RoundStatus.revealed &&
          previousStatus != RoundStatus.revealed) {
        ref.invalidate(roundQuestionProvider(nextRound.id));
        _scheduleAdvanceOnceRevealed();
      }
    });

    final bool isRevealed = round.status != RoundStatus.active;
    final AsyncValue<List<(GamePlayer, GameAnswer?)>> playersState = ref.watch(
      playerAnswersProvider((gameId: widget.gameId, roundId: round.id)),
    );

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Manche ${round.roundNumber}',
            style: AppTextStyles.caption,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xs),
          RoundTimerBar(
            remaining: _remaining,
            total: Duration(seconds: widget.roundDurationSeconds),
          ),
          const SizedBox(height: AppSpacing.lg),
          ref
              .watch(roundQuestionProvider(round.id))
              .when(
                data: (question) => Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        Text(
                          question.prompt,
                          style: AppTextStyles.headline,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.xl),
                        AnimalArena(
                          question: question,
                          mySelection: _mySelection,
                          isRevealed: isRevealed,
                          players: playersState.value ?? const <(GamePlayer, GameAnswer?)>[],
                          onSelect: (index) => _selectAnswer(index, round.status),
                        ),
                        if (isRevealed) ...[
                          const SizedBox(height: AppSpacing.xl),
                          ref
                              .watch(gamePlayersStreamProvider(widget.gameId))
                              .maybeWhen(
                                data: (players) => RankingList(players: players),
                                orElse: () => const SizedBox.shrink(),
                              ),
                        ],
                      ],
                    ),
                  ),
                ),
                loading: () => const Expanded(child: Center(child: CircularProgressIndicator())),
                error: (error, _) => Expanded(
                  child: Center(
                    child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
                  ),
                ),
              ),
        ],
      ),
    );
  }
}
