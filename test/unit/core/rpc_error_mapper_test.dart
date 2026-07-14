import 'package:betiz/core/error/failure.dart';
import 'package:betiz/core/network/rpc_error_mapper.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() {
  group('mapRpcError', () {
    test('maps a known RPC business code to a friendly ValidationFailure', () {
      final failure = mapRpcError(
        const PostgrestException(message: 'not_host'),
      );

      expect(failure, isA<ValidationFailure>());
      expect(failure.message, "Seul l'hôte peut démarrer la partie.");
    });

    test('falls through to the generic Supabase mapper for unknown messages', () {
      final failure = mapRpcError(
        const PostgrestException(message: 'some_unmapped_db_error'),
      );

      expect(failure, isA<ServerFailure>());
    });

    test('non-Postgrest errors fall through to the generic mapper too', () {
      final failure = mapRpcError(StateError('boom'));

      expect(failure, isA<UnknownFailure>());
    });
  });
}
