import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/supabase_provider.dart';
import '../../data/repositories/supabase_lobby_presence_repository.dart';
import '../../domain/repositories/lobby_presence_repository.dart';

/// What identifies "me" when joining a game's presence channel. A plain
/// record: Dart 3 gives it structural `==`/`hashCode` for free, which is
/// exactly what a `.family` cache key needs.
typedef LobbyPresenceParams = ({String gameId, String selfUserId, String pseudo, String animalId});

final Provider<LobbyPresenceRepository> lobbyPresenceRepositoryProvider =
    Provider<LobbyPresenceRepository>((ref) {
  return SupabaseLobbyPresenceRepository(ref.watch(supabaseClientProvider));
});

/// The set of user ids currently connected to [LobbyPresenceParams.gameId]'s
/// lobby. Distinct from `game_players` (a DB row can exist for a player
/// who force-quit the app): this reflects a live socket.
final StreamProviderFamily<Set<String>, LobbyPresenceParams> lobbyPresenceStreamProvider =
    StreamProvider.family<Set<String>, LobbyPresenceParams>((ref, params) {
  return ref
      .watch(lobbyPresenceRepositoryProvider)
      .watchOnlinePlayers(
        gameId: params.gameId,
        selfUserId: params.selfUserId,
        selfPayload: {'pseudo': params.pseudo, 'animal_id': params.animalId},
      );
});
