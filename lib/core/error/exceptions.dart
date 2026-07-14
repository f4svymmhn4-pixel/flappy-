/// Exceptions live at the data layer only. Repositories catch these and
/// convert them to a [Failure] before they cross into the domain layer.
library;

/// Thrown by network/connectivity checks when the device is offline.
class NetworkException implements Exception {
  const NetworkException([this.message = 'Pas de connexion internet.']);

  final String message;

  @override
  String toString() => 'NetworkException: $message';
}

/// Thrown by remote data sources (Supabase, REST) on a non-success response.
class ServerException implements Exception {
  const ServerException([this.message = 'Une erreur serveur est survenue.', this.statusCode]);

  final String message;
  final int? statusCode;

  @override
  String toString() => 'ServerException($statusCode): $message';
}

/// Thrown by Supabase Auth calls (anonymous sign-in, pseudo claim, ...).
class AuthException implements Exception {
  const AuthException([this.message = "Erreur d'authentification."]);

  final String message;

  @override
  String toString() => 'AuthException: $message';
}

/// Thrown when a realtime channel subscription fails or times out.
class RealtimeException implements Exception {
  const RealtimeException([this.message = 'Connexion temps réel perdue.']);

  final String message;

  @override
  String toString() => 'RealtimeException: $message';
}

/// Thrown by local persistence (SharedPreferences, secure storage, ...).
class CacheException implements Exception {
  const CacheException([this.message = 'Erreur de stockage local.']);

  final String message;

  @override
  String toString() => 'CacheException: $message';
}
