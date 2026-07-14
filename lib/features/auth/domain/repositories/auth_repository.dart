import '../../../../core/error/result.dart';

/// Wraps Supabase Auth. The app only ever uses anonymous sessions (a
/// pseudo, claimed separately in onboarding, is what identifies a player —
/// see profiles.pseudo), so this surface is intentionally small.
abstract interface class AuthRepository {
  /// The current session's user id, or `null` if nobody is signed in yet.
  String? get currentUserId;

  /// Emits the current user id every time auth state changes (sign-in,
  /// sign-out, token refresh), and once immediately with the current value.
  Stream<String?> get userIdChanges;

  /// Creates (or resumes) an anonymous session. A no-op if already signed
  /// in. Triggers the `handle_new_user` DB trigger on first sign-in, which
  /// provisions the profile row and the 3 starter animals.
  Future<Result<String>> ensureSignedIn();
}
