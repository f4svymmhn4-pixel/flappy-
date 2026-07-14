/// Centralized route path constants. Screens navigate via [go_router]'s
/// named routes (see [AppRouter]) rather than hardcoded path strings, but
/// keeping the raw paths here too makes deep-link handling and tests
/// straightforward.
abstract final class RoutePaths {
  static const String splash = '/';
  static const String onboardingPseudo = '/onboarding/pseudo';
  static const String home = '/home';
  static const String playMode = '/play';
  static const String joinByCode = '/play/join';
  static const String difficultySelect = '/play/difficulty';
  static const String animalSelect = '/play/animal';
  static const String matchmaking = '/play/matchmaking';
  static const String privateLobby = '/lobby/:gameId';
  static const String game = '/game/:gameId';
  static const String shop = '/shop';
  static const String profile = '/profile';
}

/// Named counterparts of [RoutePaths], used with `context.goNamed(...)` so
/// path typos are caught at the call site instead of at runtime.
abstract final class RouteNames {
  static const String splash = 'splash';
  static const String onboardingPseudo = 'onboardingPseudo';
  static const String home = 'home';
  static const String playMode = 'playMode';
  static const String joinByCode = 'joinByCode';
  static const String difficultySelect = 'difficultySelect';
  static const String animalSelect = 'animalSelect';
  static const String matchmaking = 'matchmaking';
  static const String privateLobby = 'privateLobby';
  static const String game = 'game';
  static const String shop = 'shop';
  static const String profile = 'profile';
}
