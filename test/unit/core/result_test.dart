import 'package:betiz/core/error/failure.dart';
import 'package:betiz/core/error/result.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Result', () {
    test('success exposes the value and no failure', () {
      const Result<int> result = Result.success(42);

      expect(result.isSuccess, isTrue);
      expect(result.isFailure, isFalse);
      expect(result.valueOrNull, 42);
      expect(result.failureOrNull, isNull);
    });

    test('failure exposes the failure and no value', () {
      const Failure failure = ServerFailure('boom');
      const Result<int> result = Result.failure(failure);

      expect(result.isSuccess, isFalse);
      expect(result.isFailure, isTrue);
      expect(result.valueOrNull, isNull);
      expect(result.failureOrNull, failure);
    });

    test('when dispatches to the matching branch exactly once', () {
      const Result<int> success = Result.success(1);
      const Result<int> failure = Result.failure(NetworkFailure());

      expect(
        success.when(success: (v) => 'ok:$v', failure: (f) => 'err:${f.message}'),
        'ok:1',
      );
      expect(
        failure.when(success: (v) => 'ok:$v', failure: (f) => 'err:${f.message}'),
        'err:Pas de connexion internet.',
      );
    });

    test('map transforms a success value and leaves a failure untouched', () {
      const Result<int> success = Result.success(2);
      const Failure originalFailure = ValidationFailure('invalid');
      const Result<int> failure = Result.failure(originalFailure);

      expect(success.map((v) => v * 10).valueOrNull, 20);
      expect(failure.map((v) => v * 10).failureOrNull, originalFailure);
    });

    test('two failures with the same message are equal', () {
      expect(const ServerFailure('x'), const ServerFailure('x'));
      expect(const ServerFailure('x'), isNot(const NetworkFailure('x')));
    });
  });
}
