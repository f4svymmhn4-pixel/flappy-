import '../../../../core/error/result.dart';
import '../entities/animal.dart';

abstract interface class AnimalRepository {
  /// The full 50-animal catalog (locked and unlocked).
  Future<Result<List<Animal>>> getCatalog();

  /// The ids of animals [userId] has unlocked (starters + purchases +
  /// rewards).
  Future<Result<Set<String>>> getUnlockedAnimalIds(String userId);
}
