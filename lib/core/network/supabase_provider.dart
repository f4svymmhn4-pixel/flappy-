import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Exposes the singleton [SupabaseClient] created during bootstrap.
///
/// This must be overridden in the root [ProviderScope] once
/// `Supabase.initialize` has completed (see `lib/bootstrap.dart`); every
/// feature data source depends on this provider rather than calling
/// `Supabase.instance.client` directly, which keeps the client swappable in
/// tests via `ProviderScope(overrides: ...)`.
final Provider<SupabaseClient> supabaseClientProvider = Provider<SupabaseClient>((ref) {
  throw UnimplementedError(
    'supabaseClientProvider must be overridden in ProviderScope after '
    'Supabase.initialize() completes in bootstrap.dart.',
  );
});

/// Convenience access to the currently authenticated Supabase user, updated
/// in realtime as auth state changes (sign-in, sign-out, token refresh).
final StreamProvider<AuthState> authStateChangesProvider = StreamProvider<AuthState>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return client.auth.onAuthStateChange;
});
