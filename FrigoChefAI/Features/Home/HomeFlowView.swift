import SwiftUI

/// Root of the "Frigo" tab: owns the navigation stack for the whole
/// scan → analyze → results → recipe detail flow.
struct HomeFlowView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            HomeView(path: $path)
                .withAppRouteDestinations(path: $path)
        }
    }
}
