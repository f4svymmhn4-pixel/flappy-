import 'package:meta/meta.dart';

import 'failure.dart';

/// A [Failure]-or-value type returned by every repository and use case.
///
/// Using an explicit sealed return type (rather than throwing) forces every
/// call site to handle the failure path, which is what lets us guarantee
/// "toutes les erreurs sont gérées" across the app. Prefer the [when]/[map]
/// helpers over manual `is` checks so new variants can never be missed.
@immutable
sealed class Result<T> {
  const Result();

  const factory Result.success(T value) = Success<T>;
  const factory Result.failure(Failure failure) = Error<T>;

  bool get isSuccess => this is Success<T>;
  bool get isFailure => this is Error<T>;

  /// The success value, or `null` if this is a [Error].
  T? get valueOrNull => switch (this) {
        Success<T>(:final value) => value,
        Error<T>() => null,
      };

  /// The failure, or `null` if this is a [Success].
  Failure? get failureOrNull => switch (this) {
        Success<T>() => null,
        Error<T>(:final failure) => failure,
      };

  /// Exhaustively pattern-match both branches.
  R when<R>({
    required R Function(T value) success,
    required R Function(Failure failure) failure,
  }) =>
      switch (this) {
        Success<T>(:final value) => success(value),
        Error<T>(failure: final f) => failure(f),
      };

  /// Transform the success value, leaving a failure untouched.
  Result<R> map<R>(R Function(T value) transform) => switch (this) {
        Success<T>(:final value) => Result.success(transform(value)),
        Error<T>(:final failure) => Result.failure(failure),
      };
}

final class Success<T> extends Result<T> {
  const Success(this.value);

  final T value;

  @override
  bool operator ==(Object other) => other is Success<T> && other.value == value;

  @override
  int get hashCode => Object.hash(runtimeType, value);
}

final class Error<T> extends Result<T> {
  const Error(this.failure);

  final Failure failure;

  @override
  bool operator ==(Object other) => other is Error<T> && other.failure == failure;

  @override
  int get hashCode => Object.hash(runtimeType, failure);
}
