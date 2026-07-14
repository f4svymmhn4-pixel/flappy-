import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app/app.dart';
import 'core/config/env.dart';
import 'core/logging/app_logger.dart';
import 'core/network/supabase_provider.dart';

/// App entry sequence, kept out of `main.dart` so widget tests can import
/// `app/app.dart` directly without paying for Firebase/Supabase
/// initialization.
///
/// Order matters: Firebase must finish (or fail gracefully) before the
/// logger wires Crashlytics reporting into it, Supabase must finish before
/// any provider that reads [supabaseClientProvider] is first watched, and
/// neither failure may crash the app in environments where it isn't
/// configured yet (e.g. a fresh checkout before `flutterfire configure`).
Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();

  final bool firebaseReady = await _initFirebase();

  AppLogger.init(
    onError: firebaseReady
        ? (error, stack) {
            unawaited(FirebaseCrashlytics.instance.recordError(error, stack, fatal: false));
          }
        : null,
  );

  final bool supabaseReady = await _initSupabase();

  runApp(
    ProviderScope(
      overrides: [
        if (supabaseReady) supabaseClientProvider.overrideWithValue(Supabase.instance.client),
      ],
      child: const BetizApp(),
    ),
  );
}

Future<bool> _initFirebase() async {
  try {
    await Firebase.initializeApp();

    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
    return true;
  } catch (error) {
    // Expected on a fresh checkout before `flutterfire configure` has been
    // run for this platform; analytics/crashlytics/messaging stay inert.
    debugPrint('Firebase init skipped: $error');
    return false;
  }
}

Future<bool> _initSupabase() async {
  if (!Env.isConfigured) {
    debugPrint(
      'Supabase is not configured — pass --dart-define-from-file=env/dev.json. '
      'See env/dev.json.example.',
    );
    return false;
  }

  await Supabase.initialize(
    url: Env.supabaseUrl,
    publishableKey: Env.supabaseAnonKey,
    debug: !Env.isProduction,
  );
  return true;
}
