import Foundation
import Observation

@MainActor
@Observable
final class ResultsViewModel {
    let analysis: FridgeAnalysis
    var activeFilters: Set<DietaryFilter> = []
    var isFiltersPresented = false

    init(analysis: FridgeAnalysis) {
        self.analysis = analysis
    }

    func recipes(for category: MealCategory) -> [Recipe] {
        let all = analysis.recipesByCategory[category] ?? []
        guard !activeFilters.isEmpty else { return all }
        return all.filter { $0.matches(all: activeFilters) }
    }

    var hasAnyVisibleRecipe: Bool {
        MealCategory.orderedCases.contains { !recipes(for: $0).isEmpty }
    }
}
