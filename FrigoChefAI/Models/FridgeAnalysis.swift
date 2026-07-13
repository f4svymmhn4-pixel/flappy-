import Foundation

/// A completed end-to-end analysis: the photo that was analyzed, the
/// ingredients detected in it, and the recipes generated from them.
/// Persisted to history so results remain available offline.
struct FridgeAnalysis: Identifiable, Codable, Hashable {
    let id: UUID
    let date: Date
    let detectedIngredients: [DetectedIngredient]
    let recipesByCategory: [MealCategory: [Recipe]]

    init(
        id: UUID = UUID(),
        date: Date = .now,
        detectedIngredients: [DetectedIngredient],
        recipesByCategory: [MealCategory: [Recipe]]
    ) {
        self.id = id
        self.date = date
        self.detectedIngredients = detectedIngredients
        self.recipesByCategory = recipesByCategory
    }

    var totalRecipeCount: Int {
        recipesByCategory.values.reduce(0) { $0 + $1.count }
    }

    var allRecipes: [Recipe] {
        MealCategory.orderedCases.flatMap { recipesByCategory[$0] ?? [] }
    }
}
