/// Compile-time configuration, injected via `--dart-define-from-file`.
///
/// We deliberately avoid bundling a `.env` asset: `String.fromEnvironment`
/// values are baked into the binary at compile time by the Dart compiler,
/// which keeps secrets out of the asset bundle and out of source control.
/// Supply real values with, e.g.:
///
/// ```sh
/// flutter run --dart-define-from-file=env/dev.json
/// ```
///
/// See `env/dev.json.example` for the expected keys. The Supabase anon key
/// is safe to ship client-side by design (it is scoped by Row Level
/// Security); no server-only secret should ever live in this class.
abstract final class Env {
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');

  static const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  static const String environment = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'development',
  );

  static bool get isProduction => environment == 'production';

  static bool get isConfigured => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;
}
