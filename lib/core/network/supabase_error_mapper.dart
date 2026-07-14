import 'package:supabase_flutter/supabase_flutter.dart';

import '../error/failure.dart';

/// Postgres SQLSTATE codes we give a friendlier message than the raw one
/// Postgrest/postgres would otherwise surface.
const String _uniqueViolation = '23505';
const String _checkViolation = '23514';

/// Translates any error a Supabase call can throw into a [Failure] the
/// presentation layer knows how to render. Centralized here so every
/// repository shares the same mapping instead of re-implementing it.
Failure mapSupabaseError(Object error) {
  if (error is PostgrestException) {
    switch (error.code) {
      case _uniqueViolation:
        return const ValidationFailure('Cette valeur est déjà utilisée.');
      case _checkViolation:
        return const ValidationFailure('Valeur invalide.');
      default:
        return ServerFailure(error.message);
    }
  }
  if (error is AuthException) {
    return AuthFailure(error.message);
  }
  return UnknownFailure(error.toString());
}
