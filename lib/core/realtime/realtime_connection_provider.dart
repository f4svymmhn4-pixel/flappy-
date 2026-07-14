import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../network/supabase_provider.dart';
import 'realtime_connection_status.dart';

final Provider<RealtimeConnectionStatus> realtimeConnectionStatusProvider =
    Provider<RealtimeConnectionStatus>((ref) {
  final status = RealtimeConnectionStatus(ref.watch(supabaseClientProvider));
  ref.onDispose(status.dispose);
  return status;
});

/// `true` once connected, `false` while offline/reconnecting. Screens use
/// this to show a "Reconnexion..." banner instead of silently stalling.
final StreamProvider<bool> isRealtimeConnectedProvider = StreamProvider<bool>((ref) {
  return ref.watch(realtimeConnectionStatusProvider).onChange;
});
