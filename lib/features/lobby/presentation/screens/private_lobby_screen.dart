import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../../animals/domain/entities/animal.dart';
import '../../../animals/presentation/controllers/animals_controller.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../../game/domain/entities/game.dart';
import '../../../game/domain/entities/game_player.dart';
import '../../../game/domain/entities/game_status.dart';
import '../../../game/presentation/controllers/game_lifecycle_controller.dart';
import '../../../game/presentation/controllers/game_realtime_controller.dart';

class PrivateLobbyScreen extends ConsumerWidget {
  const PrivateLobbyScreen({required this.gameId, super.key});

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<Game?> gameState = ref.watch(gameStreamProvider(gameId));

    ref.listen(gameStreamProvider(gameId), (previous, next) {
      final Game? game = next.value;
      if (game != null && game.status == GameStatus.inProgress) {
        context.go(RoutePaths.game.replaceFirst(':gameId', gameId));
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salle de jeu'),
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app_rounded),
            tooltip: 'Quitter',
            onPressed: () async {
              await ref.read(gameLifecycleRepositoryProvider).leaveGame(gameId);
              if (context.mounted) context.go(RoutePaths.home);
            },
          ),
        ],
      ),
      body: gameState.when(
        data: (game) => game == null
            ? const Center(child: Text("Cette partie n'existe plus."))
            : _LobbyContent(gameId: gameId, game: game),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
        ),
      ),
    );
  }
}

class _LobbyContent extends ConsumerWidget {
  const _LobbyContent({required this.gameId, required this.game});

  final String gameId;
  final Game game;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<String> userIdState = ref.watch(currentUserIdProvider);
    final AsyncValue<List<GamePlayer>> playersState = ref.watch(gamePlayersStreamProvider(gameId));
    final AsyncValue<List<Animal>> catalogState = ref.watch(animalCatalogProvider);

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (game.roomCode != null) _RoomCodeCard(roomCode: game.roomCode!),
          const SizedBox(height: AppSpacing.lg),
          const Text('Joueurs', style: AppTextStyles.title),
          const SizedBox(height: AppSpacing.sm),
          Expanded(
            child: playersState.when(
              data: (players) => catalogState.when(
                data: (catalog) => _PlayerList(players: players, catalog: catalog),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(
                  child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
                ),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(
                child: Text(error is Failure ? error.message : 'Une erreur est survenue.'),
              ),
            ),
          ),
          userIdState.maybeWhen(
            data: (userId) {
              final bool isHost = game.hostId == userId;
              final int activePlayers = playersState.value
                      ?.where((player) => player.isActive)
                      .length ??
                  0;
              if (!isHost) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: AppSpacing.md),
                  child: Text("En attente que l'hôte démarre la partie..."),
                );
              }
              final bool canStart = activePlayers >= game.minPlayers;
              return Padding(
                padding: const EdgeInsets.only(top: AppSpacing.md),
                child: ElevatedButton(
                  onPressed: canStart
                      ? () => ref.read(gameLifecycleRepositoryProvider).startPrivateGame(gameId)
                      : null,
                  child: Text(canStart ? 'Démarrer' : 'En attente de joueurs ($activePlayers/${game.minPlayers})'),
                ),
              );
            },
            orElse: () => const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _RoomCodeCard extends StatelessWidget {
  const _RoomCodeCard({required this.roomCode});

  final String roomCode;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.primary.withValues(alpha: 0.1),
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        onTap: () {
          Clipboard.setData(ClipboardData(text: roomCode));
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(const SnackBar(content: Text('Code copié.')));
        },
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            children: [
              const Text('Code de la partie', style: AppTextStyles.caption),
              const SizedBox(height: AppSpacing.xs),
              Text(
                roomCode,
                style: AppTextStyles.displayLarge.copyWith(letterSpacing: 6),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PlayerList extends StatelessWidget {
  const _PlayerList({required this.players, required this.catalog});

  final List<GamePlayer> players;
  final List<Animal> catalog;

  @override
  Widget build(BuildContext context) {
    final List<GamePlayer> active = players.where((player) => player.isActive).toList();
    if (active.isEmpty) {
      return const Center(child: Text('En attente de joueurs...'));
    }

    return ListView.separated(
      itemCount: active.length,
      separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.sm),
      itemBuilder: (context, index) {
        final GamePlayer player = active[index];
        final Animal? animal = _findAnimal(catalog, player.animalId);

        return Card(
          child: ListTile(
            leading: const Icon(Icons.pets_rounded),
            title: Text(animal?.name ?? 'Animal'),
            trailing: player.userId == null ? const Icon(Icons.smart_toy_rounded) : null,
          ),
        );
      },
    );
  }
}

Animal? _findAnimal(List<Animal> catalog, String animalId) {
  for (final animal in catalog) {
    if (animal.id == animalId) return animal;
  }
  return null;
}
