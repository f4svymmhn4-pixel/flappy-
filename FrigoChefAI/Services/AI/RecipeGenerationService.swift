import Foundation

/// Abstraction over "what turns a list of ingredients into recipe ideas".
/// Swap `MockRecipeGenerationService` for a real LLM-backed provider by
/// conforming to this protocol — the UI only ever talks to the protocol.
protocol RecipeGenerationServiceProtocol {
    func generateRecipes(
        from ingredients: [DetectedIngredient],
        filters: Set<DietaryFilter>
    ) async throws -> [MealCategory: [Recipe]]
}

enum RecipeGenerationError: LocalizedError {
    case noIngredientsProvided
    case providerFailure(String)

    var errorDescription: String? {
        switch self {
        case .noIngredientsProvided:
            return "Aucun ingrédient détecté pour générer des recettes."
        case .providerFailure(let message):
            return message
        }
    }
}

/// Development/offline implementation: matches a bundled recipe database
/// against the detected ingredients. It deliberately does not try to use
/// every ingredient — it favors variety of styles (salade, burger, pâtes,
/// wok, curry, bowl, ...) and recipes that need the fewest extra purchases.
final class MockRecipeGenerationService: RecipeGenerationServiceProtocol {
    private let templates: [RecipeTemplate]

    init(bundle: Bundle = .main) {
        templates = Self.loadTemplates(bundle: bundle)
    }

    func generateRecipes(
        from ingredients: [DetectedIngredient],
        filters: Set<DietaryFilter>
    ) async throws -> [MealCategory: [Recipe]] {
        guard !ingredients.isEmpty else { throw RecipeGenerationError.noIngredientsProvided }
        guard !templates.isEmpty else { throw RecipeGenerationError.providerFailure("Base de recettes introuvable.") }

        // Simulates generation latency for the loading animation.
        try await Task.sleep(for: .seconds(1.5))

        var result: [MealCategory: [Recipe]] = [:]
        for category in MealCategory.orderedCases {
            let matched = templates
                .filter { $0.mealCategory == category }
                .map { Recipe(template: $0, availableIngredients: ingredients) }
                .filter { $0.matches(all: filters) }
                // Prefer recipes that need the fewest extra purchases,
                // so cooking with a minimum of missing ingredients comes first.
                .sorted {
                    if $0.missingIngredients.count != $1.missingIngredients.count {
                        return $0.missingIngredients.count < $1.missingIngredients.count
                    }
                    return $0.usedIngredients.count > $1.usedIngredients.count
                }

            result[category] = Array(matched.prefix(category.targetRecipeCount))
        }
        return result
    }

    private static func loadTemplates(bundle: Bundle) -> [RecipeTemplate] {
        guard
            let url = bundle.url(forResource: "recipes", withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let items = try? JSONDecoder().decode([RecipeTemplate].self, from: data)
        else { return [] }
        return items
    }
}
