import '../../../../core/error/result.dart';

/// Wraps the `unlock_animal` RPC (supabase/migrations/0018_shop.sql). Cost
/// and balance checks happen entirely server-side — this never sends a
/// client-computed price, only the animal id the player wants.
abstract interface class ShopRepository {
  /// Returns the new token balance on success.
  Future<Result<int>> unlockAnimal(String animalId);
}
