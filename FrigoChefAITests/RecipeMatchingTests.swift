import XCTest
@testable import FrigoChefAI

final class RecipeMatchingTests: XCTestCase {
    private func makeTemplate(
        required: [String],
        mealCategory: MealCategory = .lunch,
        calories: Int = 400,
        proteinG: Double = 15,
        prepTimeMinutes: Int = 20,
        costEUR: Double = 3,
        tags: [DietaryFilter] = []
    ) -> RecipeTemplate {
        RecipeTemplate(
            id: "test-recipe",
            name: "Recette test",
            mealCategory: mealCategory,
            cuisineStyle: "Bowl",
            prepTimeMinutes: prepTimeMinutes,
            difficulty: .easy,
            servings: 2,
            estimatedCostEUR: costEUR,
            calories: calories,
            proteinG: proteinG,
            carbsG: 30,
            fatG: 10,
            fiberG: 5,
            sugarG: 5,
            sodiumMg: 200,
            requiredIngredients: required,
            dietaryTags: tags,
            steps: ["Étape 1", "Étape 2"],
            imageSymbol: "leaf.fill",
            gradientStart: "84FAB0",
            gradientEnd: "8FD3F4"
        )
    }

    func testUsedAndMissingIngredientsAreSplitCorrectly() {
        let template = makeTemplate(required: ["tomates", "ail", "huile d'olive"])
        let available = [
            DetectedIngredient(name: "Tomates", category: .vegetable, confidence: 0.9),
            DetectedIngredient(name: "Ail", category: .vegetable, confidence: 0.8),
        ]

        let recipe = Recipe(template: template, availableIngredients: available)

        XCTAssertEqual(Set(recipe.usedIngredients), ["tomates", "ail"])
        XCTAssertEqual(recipe.missingIngredients, ["huile d'olive"])
        XCTAssertTrue(recipe.hasMissingIngredients)
    }

    func testMatchingIsCaseInsensitive() {
        let template = makeTemplate(required: ["Tomates"])
        let available = [DetectedIngredient(name: "tomates", category: .vegetable, confidence: 0.9)]

        let recipe = Recipe(template: template, availableIngredients: available)

        XCTAssertEqual(recipe.usedIngredients, ["tomates"])
        XCTAssertTrue(recipe.missingIngredients.isEmpty)
    }

    func testHighProteinFilterUsesThreshold() {
        let highProtein = Recipe(
            template: makeTemplate(required: [], proteinG: 25),
            availableIngredients: []
        )
        let lowProtein = Recipe(
            template: makeTemplate(required: [], proteinG: 10),
            availableIngredients: []
        )

        XCTAssertTrue(highProtein.matches(.highProtein))
        XCTAssertFalse(lowProtein.matches(.highProtein))
    }

    func testQuickFilterUsesPrepTime() {
        let quick = Recipe(template: makeTemplate(required: [], prepTimeMinutes: 10), availableIngredients: [])
        let slow = Recipe(template: makeTemplate(required: [], prepTimeMinutes: 30), availableIngredients: [])

        XCTAssertTrue(quick.matches(.quick))
        XCTAssertFalse(slow.matches(.quick))
    }

    func testVegetarianFilterReliesOnExplicitTag() {
        let tagged = Recipe(template: makeTemplate(required: [], tags: [.vegetarian]), availableIngredients: [])
        let untagged = Recipe(template: makeTemplate(required: [], tags: []), availableIngredients: [])

        XCTAssertTrue(tagged.matches(.vegetarian))
        XCTAssertFalse(untagged.matches(.vegetarian))
    }

    func testMatchesAllRequiresEveryFilter() {
        let recipe = Recipe(
            template: makeTemplate(required: [], calories: 300, proteinG: 25, tags: [.vegan]),
            availableIngredients: []
        )

        XCTAssertTrue(recipe.matches(all: [.highProtein, .lowCalorie, .vegan]))
        XCTAssertFalse(recipe.matches(all: [.highProtein, .lowCalorie, .vegetarian]))
    }
}
