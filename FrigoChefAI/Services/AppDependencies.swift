import SwiftUI

/// Single composition point for every swappable service in the app.
///
/// To plug in a real AI provider later:
/// 1. Create a type conforming to `VisionAnalysisServiceProtocol` and/or
///    `RecipeGenerationServiceProtocol` (e.g. `OpenAIVisionAnalysisService`).
/// 2. Replace the corresponding `Mock...` instance below.
/// Nothing in the Features layer references a concrete implementation —
/// every ViewModel receives its services through this container.
@MainActor
final class AppDependencies {
    let visionAnalysisService: VisionAnalysisServiceProtocol
    let recipeGenerationService: RecipeGenerationServiceProtocol
    let dishImageProvider: DishImageProviding
    let favoritesStore: FavoritesStore
    let historyStore: HistoryStore

    init(
        visionAnalysisService: VisionAnalysisServiceProtocol = MockVisionAnalysisService(),
        recipeGenerationService: RecipeGenerationServiceProtocol = MockRecipeGenerationService(),
        dishImageProvider: DishImageProviding = PlaceholderDishImageProvider(),
        favoritesStore: FavoritesStore,
        historyStore: HistoryStore
    ) {
        self.visionAnalysisService = visionAnalysisService
        self.recipeGenerationService = recipeGenerationService
        self.dishImageProvider = dishImageProvider
        self.favoritesStore = favoritesStore
        self.historyStore = historyStore
    }
}

private struct AppDependenciesKey: EnvironmentKey {
    static let defaultValue: AppDependencies? = nil
}

extension EnvironmentValues {
    var dependencies: AppDependencies? {
        get { self[AppDependenciesKey.self] }
        set { self[AppDependenciesKey.self] = newValue }
    }
}
