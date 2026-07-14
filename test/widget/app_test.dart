import 'package:betiz/app/app.dart';
import 'package:betiz/core/error/result.dart';
import 'package:betiz/features/auth/domain/repositories/auth_repository.dart';
import 'package:betiz/features/auth/presentation/controllers/auth_controller.dart';
import 'package:betiz/features/profile/domain/entities/profile.dart';
import 'package:betiz/features/profile/domain/repositories/profile_repository.dart';
import 'package:betiz/features/profile/presentation/controllers/profile_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

class MockProfileRepository extends Mock implements ProfileRepository {}

const String _userId = 'user-1';

const Profile _profileWithoutPseudo = Profile(
  id: _userId,
  pseudo: null,
  avatarAnimalId: null,
  tokens: 0,
  xp: 0,
  level: 1,
  gamesPlayed: 0,
  gamesWon: 0,
  totalCorrectAnswers: 0,
  totalAnswers: 0,
  avgResponseTimeMs: 0,
);

const Profile _profileWithPseudo = Profile(
  id: _userId,
  pseudo: 'Renard',
  avatarAnimalId: null,
  tokens: 120,
  xp: 0,
  level: 1,
  gamesPlayed: 0,
  gamesWon: 0,
  totalCorrectAnswers: 0,
  totalAnswers: 0,
  avgResponseTimeMs: 0,
);

void main() {
  late MockAuthRepository authRepository;
  late MockProfileRepository profileRepository;

  setUp(() {
    authRepository = MockAuthRepository();
    profileRepository = MockProfileRepository();
    when(() => authRepository.currentUserId).thenReturn(_userId);
  });

  List<Override> overridesFor(Profile profile) {
    when(() => profileRepository.getProfile(_userId)).thenAnswer(
      (_) async => Result.success(profile),
    );
    return [
      authRepositoryProvider.overrideWithValue(authRepository),
      profileRepositoryProvider.overrideWithValue(profileRepository),
    ];
  }

  testWidgets('shows the BETIZ splash first', (tester) async {
    await tester.pumpWidget(
      ProviderScope(overrides: overridesFor(_profileWithPseudo), child: const BetizApp()),
    );

    expect(find.text('BETIZ'), findsOneWidget);

    // Let flutter_animate's ticker finish so no timer is left pending
    // when the test tears the widget tree down.
    await tester.pumpAndSettle();
  });

  testWidgets('routes to onboarding when no pseudo has been claimed yet', (tester) async {
    await tester.pumpWidget(
      ProviderScope(overrides: overridesFor(_profileWithoutPseudo), child: const BetizApp()),
    );

    await tester.pumpAndSettle();

    expect(find.text('Choisis ton pseudo'), findsOneWidget);
  });

  testWidgets('routes straight to home once a pseudo is already set', (tester) async {
    await tester.pumpWidget(
      ProviderScope(overrides: overridesFor(_profileWithPseudo), child: const BetizApp()),
    );

    await tester.pumpAndSettle();

    expect(find.text('Renard'), findsWidgets);
    expect(find.text('Choisis ton pseudo'), findsNothing);
  });
}
