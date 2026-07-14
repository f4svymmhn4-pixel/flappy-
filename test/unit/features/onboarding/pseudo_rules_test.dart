import 'package:betiz/features/onboarding/domain/pseudo_rules.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('validatePseudo', () {
    test('accepts a valid pseudo', () {
      expect(validatePseudo('Renard_42'), isNull);
    });

    test('rejects a pseudo shorter than the minimum length', () {
      expect(validatePseudo('ab'), isNotNull);
    });

    test('rejects a pseudo longer than the maximum length', () {
      expect(validatePseudo('a' * (pseudoMaxLength + 1)), isNotNull);
    });

    test('accepts the boundary lengths', () {
      expect(validatePseudo('a' * pseudoMinLength), isNull);
      expect(validatePseudo('a' * pseudoMaxLength), isNull);
    });

    test('rejects characters outside letters/digits/underscore', () {
      expect(validatePseudo('Renard Roux'), isNotNull);
      expect(validatePseudo('Renard!'), isNotNull);
      expect(validatePseudo('Renard-Roux'), isNotNull);
      expect(validatePseudo('Renàrd'), isNotNull);
    });
  });
}
