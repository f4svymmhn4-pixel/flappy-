import 'dart:async';

import 'package:supabase_flutter/supabase_flutter.dart';

/// Whether the shared Supabase Realtime websocket is currently up.
///
/// [RealtimeClient] only exposes connection state through `onOpen`/
/// `onClose`/`onError` callbacks, not a `Stream`; this wraps them into one
/// so the rest of the app (a global "reconnexion..." banner, a lobby/game
/// screen deciding whether to show a spinner) can just watch a value
/// instead of registering its own callbacks.
class RealtimeConnectionStatus {
  RealtimeConnectionStatus(this._client) {
    _client.realtime
      ..onOpen(() => _controller.add(true))
      ..onClose((_) => _controller.add(false))
      ..onError((_) => _controller.add(false));
  }

  final SupabaseClient _client;
  final StreamController<bool> _controller = StreamController<bool>.broadcast();

  bool get isConnected => _client.realtime.isConnected;

  /// Emits the current state immediately, then every subsequent change.
  Stream<bool> get onChange async* {
    yield isConnected;
    yield* _controller.stream;
  }

  void dispose() {
    unawaited(_controller.close());
  }
}
