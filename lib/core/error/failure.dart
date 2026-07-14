import 'package:equatable/equatable.dart';

/// Base type for all recoverable errors surfaced to the presentation layer.
///
/// Data sources throw [Exception]s; repositories catch them and translate
/// them into a [Failure] so that use cases and controllers never depend on
/// concrete exception types. Every subtype must carry a user-displayable
/// [message] so the UI can render it without a switch statement.
sealed class Failure extends Equatable {
  const Failure(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}

/// The device has no usable network connection.
final class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'Pas de connexion internet.']);
}

/// The backend reached us but rejected or failed the request.
final class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Une erreur serveur est survenue.']);
}

/// Supabase Auth rejected the request (expired session, invalid pseudo, ...).
final class AuthFailure extends Failure {
  const AuthFailure([super.message = "Erreur d'authentification."]);
}

/// A realtime channel dropped or failed to (re)subscribe.
final class RealtimeFailure extends Failure {
  const RealtimeFailure([super.message = 'Connexion temps réel perdue.']);
}

/// Input failed local validation before ever reaching the network.
final class ValidationFailure extends Failure {
  const ValidationFailure(super.message);
}

/// A local cache/storage read or write failed.
final class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Erreur de stockage local.']);
}

/// Catch-all for anything that doesn't map to a known category.
final class UnknownFailure extends Failure {
  const UnknownFailure([super.message = 'Une erreur inattendue est survenue.']);
}
