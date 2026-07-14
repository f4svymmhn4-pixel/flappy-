import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Abstraction over device connectivity so repositories can fail fast with
/// a [NetworkFailure] instead of waiting on a doomed request.
abstract interface class NetworkInfo {
  Future<bool> get isConnected;

  /// Emits on every connectivity change; used to drive automatic
  /// reconnection of realtime channels.
  Stream<bool> get onConnectivityChanged;
}

class ConnectivityNetworkInfo implements NetworkInfo {
  ConnectivityNetworkInfo(this._connectivity);

  final Connectivity _connectivity;

  @override
  Future<bool> get isConnected async {
    final results = await _connectivity.checkConnectivity();
    return _hasConnection(results);
  }

  @override
  Stream<bool> get onConnectivityChanged =>
      _connectivity.onConnectivityChanged.map(_hasConnection);

  bool _hasConnection(List<ConnectivityResult> results) =>
      results.any((result) => result != ConnectivityResult.none);
}

final Provider<Connectivity> connectivityProvider = Provider<Connectivity>((ref) {
  return Connectivity();
});

final Provider<NetworkInfo> networkInfoProvider = Provider<NetworkInfo>((ref) {
  return ConnectivityNetworkInfo(ref.watch(connectivityProvider));
});
