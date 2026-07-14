import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/placeholder_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/onboarding/presentation/screens/pseudo_screen.dart';
import '../../features/play_setup/presentation/screens/animal_select_screen.dart';
import '../../features/play_setup/presentation/screens/difficulty_select_screen.dart';
import '../../features/splash/presentation/screens/splash_screen.dart';
import 'route_paths.dart';

/// Single source of truth for app navigation.
///
/// Kept as a Riverpod provider (rather than a global variable) so tests can
/// override it with a scoped router, and so future auth-gated redirects can
/// `ref.watch` auth state without reaching for a singleton.
final Provider<GoRouter> appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: RoutePaths.splash,
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: RoutePaths.splash,
        name: RouteNames.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: RoutePaths.onboardingPseudo,
        name: RouteNames.onboardingPseudo,
        builder: (context, state) => const PseudoScreen(),
      ),
      GoRoute(
        path: RoutePaths.home,
        name: RouteNames.home,
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: RoutePaths.difficultySelect,
        name: RouteNames.difficultySelect,
        builder: (context, state) => const DifficultySelectScreen(),
      ),
      GoRoute(
        path: RoutePaths.animalSelect,
        name: RouteNames.animalSelect,
        builder: (context, state) => const AnimalSelectScreen(),
      ),
      GoRoute(
        path: RoutePaths.lobby,
        name: RouteNames.lobby,
        builder: (context, state) => const PlaceholderScreen(
          title: 'Salle de jeu',
          subtitle: 'Le matchmaking public arrive à une étape dédiée.',
        ),
      ),
      GoRoute(
        path: RoutePaths.lobbyPrivate,
        name: RouteNames.lobbyPrivate,
        builder: (context, state) {
          final String code = state.pathParameters['code'] ?? '';
          return PlaceholderScreen(
            title: 'Partie privée',
            subtitle: 'Code : $code',
          );
        },
      ),
      GoRoute(
        path: RoutePaths.game,
        name: RouteNames.game,
        builder: (context, state) {
          final String gameId = state.pathParameters['gameId'] ?? '';
          return PlaceholderScreen(
            title: 'Partie en cours',
            subtitle: 'Game ID : $gameId — le gameplay arrive à une étape dédiée.',
          );
        },
      ),
      GoRoute(
        path: RoutePaths.shop,
        name: RouteNames.shop,
        builder: (context, state) => const PlaceholderScreen(
          title: 'Boutique',
          subtitle: "La boutique d'animaux arrive à une étape dédiée.",
        ),
      ),
      GoRoute(
        path: RoutePaths.profile,
        name: RouteNames.profile,
        builder: (context, state) => const PlaceholderScreen(
          title: 'Profil',
          subtitle: "L'écran de profil arrive à une étape dédiée.",
        ),
      ),
    ],
  );
});
