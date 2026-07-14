import '../../../../core/error/result.dart';
import '../entities/profile.dart';

abstract interface class ProfileRepository {
  Future<Result<Profile>> getProfile(String userId);

  /// Claims a pseudo for [userId]. Fails with a [ValidationFailure] if the
  /// pseudo is already taken or violates the format rules enforced by the
  /// `profiles` table constraints (3-20 chars, letters/digits/underscore).
  Future<Result<Profile>> claimPseudo(String userId, String pseudo);
}
