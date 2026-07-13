import Foundation

/// Domain model consumed by the UI: a `RecipeTemplate` matched against the
/// ingredients detected in the user's fridge, so it carries which ingredients
/// are already available and which ones still need to be bought.
struct Recipe: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let mealCategory: MealCategory
    let cuisineStyle: String
    let prepTimeMinutes: Int
    let difficulty: RecipeDifficulty
    let servings: Int
    let estimatedCostEUR: Double
    let nutrition: NutritionInfo
    let usedIngredients: [String]
    let missingIngredients: [String]
    let dietaryTags: [DietaryFilter]
    let steps: [RecipeStep]
    let imageSymbol: String
    let gradientStart: String
    let gradientEnd: String

    var prepTimeText: String { "\(prepTimeMinutes) min" }
    var costText: String { String(format: "%.2f €", estimatedCostEUR) }
    var hasMissingIngredients: Bool { !missingIngredients.isEmpty }

    /// Returns whether this recipe satisfies a given user-selected filter.
    func matches(_ filter: DietaryFilter) -> Bool {
        switch filter {
        case .highProtein: return nutrition.proteinG >= 20
        case .lowCalorie: return nutrition.calories <= 450
        case .bulking: return nutrition.calories >= 500
        case .weightLoss: return nutrition.calories <= 400
        case .quick: return prepTimeMinutes <= 15
        case .economical: return estimatedCostEUR <= 4.0
        case .vegetarian, .vegan, .lactoseFree, .glutenFree, .gourmet:
            return dietaryTags.contains(filter)
        }
    }

    func matches(all filters: Set<DietaryFilter>) -> Bool {
        filters.allSatisfy { matches($0) }
    }
}

extension Recipe {
    /// Builds a domain `Recipe` from a template by matching its required
    /// ingredients against the ones detected in the fridge photo.
    init(template: RecipeTemplate, availableIngredients: [DetectedIngredient]) {
        let availableNames = Set(availableIngredients.map(\.normalizedName))
        let required = template.requiredIngredients.map { $0.lowercased() }

        self.id = template.id
        self.name = template.name
        self.mealCategory = template.mealCategory
        self.cuisineStyle = template.cuisineStyle
        self.prepTimeMinutes = template.prepTimeMinutes
        self.difficulty = template.difficulty
        self.servings = template.servings
        self.estimatedCostEUR = template.estimatedCostEUR
        self.nutrition = template.nutrition
        self.dietaryTags = template.dietaryTags
        self.imageSymbol = template.imageSymbol
        self.gradientStart = template.gradientStart
        self.gradientEnd = template.gradientEnd
        self.steps = template.steps.enumerated().map { index, text in
            RecipeStep(order: index + 1, instruction: text)
        }
        self.usedIngredients = required.filter { availableNames.contains($0) }
        self.missingIngredients = required.filter { !availableNames.contains($0) }
    }
}
