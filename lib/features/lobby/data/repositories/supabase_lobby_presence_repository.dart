import 'dart:async';

import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../core/error/exceptions.dart';
import '../../domain/repositories/lobby_presence_repository.dart';

class SupabaseLobbyPresenceRepository implements LobbyPresenceRepository {
  SupabaseLobbyPresenceRepository(this._client);

  final SupabaseClient _client;

  @override
  Stream<Set<String>> watchOnlinePlayers({
    required String gameId,
    required String selfUserId,
    required Map<String, dynamic> selfPayload,
  }) {
    late final StreamController<Set<String>> controller;
    RealtimeChannel? channel;

    void emitCurrentState() {
      final RealtimeChannel? current = channel;
      if (current == null || controller.isClosed) return;
      controller.add(current.presenceState().map((state) => state.key).toSet());
    }

    controller = StreamController<Set<String>>(
      onListen: () {
        final RealtimeChannel newChannel = _client.channel(
          'lobby:$gameId',
          opts: RealtimeChannelConfig(key: selfUserId),
        );
        channel = newChannel;

        newChannel
          ..onPresenceSync((_) => emitCurrentState())
          ..subscribe((status, error) async {
            if (status == RealtimeSubscribeStatus.subscribed) {
              await newChannel.track({'user_id': selfUserId, ...selfPayload});
            } else if (status == RealtimeSubscribeStatus.channelError ||
                status == RealtimeSubscribeStatus.timedOut) {
              if (!controller.isClosed) {
                controller.addError(
                  RealtimeException('Lobby presence subscription failed: $error'),
                );
              }
            }
          });
      },
      onCancel: () async {
        final RealtimeChannel? current = channel;
        if (current != null) {
          await current.untrack();
          await _client.removeChannel(current);
        }
        await controller.close();
      },
    );

    return controller.stream;
  }
}
