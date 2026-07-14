import 'package:supabase_flutter/supabase_flutter.dart';

import '../error/failure.dart';
import 'supabase_error_mapper.dart';

/// BETIZ's RPCs (see supabase/migrations/0011 onward — game lifecycle,
/// gameplay, matchmaking, shop) signal business-rule failures with
/// `raise exception '<code>'`, which Postgrest surfaces as a
/// [PostgrestException] whose `message` is exactly that code. Mapped here
/// — shared across every feature that calls an RPC — instead of in the
/// generic [mapSupabaseError], since these codes are specific to our RPC
/// surface, not a general Postgrest/Postgres concern.
const Map<String, String> _rpcErrorMessages = {
  'auth_required': 'Tu dois être connecté pour jouer.',
  'pseudo_required': "Choisis d'abord un pseudo.",
  'animal_not_unlocked': "Tu n'as pas encore débloqué cet animal.",
  'game_not_found': "Cette partie n'existe pas ou plus.",
  'game_already_started': 'La partie a déjà commencé.',
  'game_full': 'Cette partie est complète.',
  'animal_taken': 'Cet animal est déjà pris dans cette partie.',
  'not_host': "Seul l'hôte peut démarrer la partie.",
  'not_enough_players': 'Il faut au moins 2 joueurs pour démarrer.',
  'not_a_participant': 'Tu ne fais pas partie de cette partie.',
  'round_not_found': "Cette manche n'existe pas.",
  'round_not_active': 'Le temps est écoulé pour cette manche.',
  'round_still_active': "La manche n'est pas encore terminée.",
  'invalid_option': 'Réponse invalide.',
  'animal_not_found': "Cet animal n'existe pas.",
  'already_unlocked': 'Tu as déjà débloqué cet animal.',
  'insufficient_tokens': "Tu n'as pas assez de jetons.",
  'no_question_available': 'Aucune question disponible pour ce réglage.',
};

Failure mapRpcError(Object error) {
  if (error is PostgrestException) {
    final String? friendly = _rpcErrorMessages[error.message];
    if (friendly != null) return ValidationFailure(friendly);
  }
  return mapSupabaseError(error);
}
