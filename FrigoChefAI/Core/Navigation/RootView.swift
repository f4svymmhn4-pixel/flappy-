import SwiftUI

/// App root: a tab bar with three flows — the fridge-scanning flow (Home),
/// saved recipes (Favorites) and past analyses (History, available offline).
struct RootView: View {
    private enum Tab: Hashable {
        case home, favorites, history
    }

    @State private var selectedTab: Tab = .home

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeFlowView()
                .tabItem { Label("Frigo", systemImage: "refrigerator.fill") }
                .tag(Tab.home)

            FavoritesView()
                .tabItem { Label("Favoris", systemImage: "heart.fill") }
                .tag(Tab.favorites)

            HistoryView()
                .tabItem { Label("Historique", systemImage: "clock.arrow.circlepath") }
                .tag(Tab.history)
        }
        .tint(AppColors.primary)
    }
}
