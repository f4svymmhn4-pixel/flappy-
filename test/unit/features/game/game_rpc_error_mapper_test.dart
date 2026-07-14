import 'package:betiz/core/error/failure.dart';
import 'package:betiz/features/game/data/game_rpc_error_mapper.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() {
  group('mapGameRpcError', () {
    test('maps a known RPC business code to a friendly ValidationFailure', () {
      final failure = mapGameRpcError(
        const PostgrestException(message: 'not_host'),
      );

      expect(failure, isA<ValidationFailure>());
      expect(failure.message, "Seul l'hôte peut démarrer la partie.");
    });

    test('falls through to the generic Supabase mapper for unknown messages', () {
      final failure = mapGameRpcError(
        const PostgrestException(message: 'some_unmapped_db_error'),
      );

      expect(failure, isA<ServerFailure>());
    });

    test('non-Postgrest errors fall through to the generic mapper too', () {
      final failure = mapGameRpcError(StateError('boom'));

      expect(failure, isA<UnknownFailure>());
    });
  });
}
