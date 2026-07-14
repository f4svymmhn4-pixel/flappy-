import '../error/failure.dart';
import '../error/result.dart';
import 'network_info.dart';
import 'supabase_error_mapper.dart';

/// Runs [action], short-circuiting to a [NetworkFailure] if the device is
/// offline and mapping any thrown error to a [Failure] via [mapError]
/// (defaults to [mapSupabaseError]) otherwise. Every repository method
/// funnels through this instead of repeating the same try/catch
/// scaffolding. Pass a feature-specific [mapError] (e.g. one that also
/// recognizes a set of RPC business-error codes) when the generic mapping
/// isn't precise enough.
Future<Result<T>> guardRepositoryCall<T>(
  NetworkInfo networkInfo,
  Future<T> Function() action, {
  Failure Function(Object error) mapError = mapSupabaseError,
}) async {
  if (!await networkInfo.isConnected) {
    return const Result.failure(NetworkFailure());
  }
  try {
    return Result.success(await action());
  } catch (error) {
    return Result.failure(mapError(error));
  }
}
