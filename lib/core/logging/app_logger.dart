import 'dart:developer' as developer;

import 'package:logging/logging.dart';

/// Thin wrapper around package:logging so the rest of the app never imports
/// dart:developer or a third-party logger directly. In release builds,
/// [initAppLogger] wires warnings and errors into Crashlytics via the
/// [onError] callback supplied by the bootstrap step.
class AppLogger {
  AppLogger._();

  static final Logger _root = Logger('betiz');

  static bool _initialized = false;

  static void init({void Function(Object error, StackTrace stack)? onError}) {
    if (_initialized) return;
    _initialized = true;

    Logger.root.level = Level.ALL;
    Logger.root.onRecord.listen((record) {
      developer.log(
        record.message,
        time: record.time,
        level: record.level.value,
        name: record.loggerName,
        error: record.error,
        stackTrace: record.stackTrace,
      );
      if (record.level >= Level.SEVERE && record.error != null && onError != null) {
        onError(record.error!, record.stackTrace ?? StackTrace.current);
      }
    });
  }

  static Logger get instance => _root;

  static void d(String message) => _root.fine(message);
  static void i(String message) => _root.info(message);
  static void w(String message, [Object? error, StackTrace? stackTrace]) =>
      _root.warning(message, error, stackTrace);
  static void e(String message, [Object? error, StackTrace? stackTrace]) =>
      _root.severe(message, error, stackTrace);
}
