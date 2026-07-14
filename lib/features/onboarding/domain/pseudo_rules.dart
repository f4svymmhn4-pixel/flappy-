/// Client-side mirror of the `profiles_pseudo_length` /
/// `profiles_pseudo_charset` constraints, so obviously-invalid input is
/// rejected instantly instead of round-tripping to the server first.
library;

const int pseudoMinLength = 3;
const int pseudoMaxLength = 20;

final RegExp _pseudoCharset = RegExp(r'^[a-zA-Z0-9_]+$');

/// Returns a user-facing error message, or `null` if [pseudo] is valid.
String? validatePseudo(String pseudo) {
  if (pseudo.length < pseudoMinLength || pseudo.length > pseudoMaxLength) {
    return 'Entre $pseudoMinLength et $pseudoMaxLength caractères.';
  }
  if (!_pseudoCharset.hasMatch(pseudo)) {
    return 'Lettres, chiffres et underscore uniquement.';
  }
  return null;
}
