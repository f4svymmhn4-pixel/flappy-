import Foundation

/// Raw recipe data as it would be returned by a recipe-generation provider
/// (today: bundled mock JSON; tomorrow: an LLM response mapped to this same
/// shape). Kept separate from `Recipe` so the transport/DTO format can evolve
/// independently of the domain model the UI consumes.
struct RecipeTemplate: Codable {
    let id: String
    let name: String
    let mealCategory: MealCategory
    let cuisineStyle: String
    let prepTimeMinutes: Int
    let difficulty: RecipeDifficulty
    let servings: Int
    let estimatedCostEUR: Double
    let calories: Int
    let proteinG: Double
    let carbsG: Double
    let fatG: Double
    let fiberG: Double
    let sugarG: Double
    let sodiumMg: Double
    /// Canonical ingredient names required by the recipe (French, lowercase).
    let requiredIngredients: [String]
    let dietaryTags: [DietaryFilter]
    let steps: [String]
    let imageSymbol: String
    let gradientStart: String
    let gradientEnd: String

    var nutrition: NutritionInfo {
        NutritionInfo(
            calories: calories,
            proteinG: proteinG,
            carbsG: carbsG,
            fatG: fatG,
            fiberG: fiberG,
            sugarG: sugarG,
            sodiumMg: sodiumMg
        )
    }
}
