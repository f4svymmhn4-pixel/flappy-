import SwiftData
import SwiftUI

@main
struct FrigoChefAIApp: App {
    private let modelContainer: ModelContainer
    private let dependencies: AppDependencies

    init() {
        let container = PersistenceController.makeContainer()
        modelContainer = container
        let context = container.mainContext
        dependencies = AppDependencies(
            favoritesStore: FavoritesStore(modelContext: context),
            historyStore: HistoryStore(modelContext: context)
        )
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(\.dependencies, dependencies)
        }
        .modelContainer(modelContainer)
    }
}
