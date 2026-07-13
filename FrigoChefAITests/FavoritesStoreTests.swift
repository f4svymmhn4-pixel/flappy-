import SwiftData
import XCTest
@testable import FrigoChefAI

@MainActor
final class FavoritesStoreTests: XCTestCase {
    private func makeStore() -> FavoritesStore {
        let container = PersistenceController.makeContainer(inMemory: true)
        return FavoritesStore(modelContext: container.mainContext)
    }

    private func makeRecipe(id: String = "recipe-1") -> Recipe {
        Recipe(
            id: id,
            name: "Recette test",
            mealCategory: .lunch,
            cuisineStyle: "Bowl",
            prepTimeMinutes: 15,
            difficulty: .easy,
            servings: 2,
            estimatedCostEUR: 3,
            nutrition: NutritionInfo(calories: 400, proteinG: 20, carbsG: 30, fatG: 10, fiberG: 5, sugarG: 5, sodiumMg: 200),
            usedIngredients: ["tomates"],
            missingIngredients: [],
            dietaryTags: [],
            steps: [RecipeStep(order: 1, instruction: "Mélanger.")],
            imageSymbol: "leaf.fill",
            gradientStart: "84FAB0",
            gradientEnd: "8FD3F4"
        )
    }

    func testToggleFavoriteAddsAndRemoves() {
        let store = makeStore()
        let recipe = makeRecipe()

        XCTAssertFalse(store.isFavorite(recipe.id))

        store.toggleFavorite(recipe)
        XCTAssertTrue(store.isFavorite(recipe.id))
        XCTAssertEqual(store.fetchAllFavorites().map(\.id), [recipe.id])

        store.toggleFavorite(recipe)
        XCTAssertFalse(store.isFavorite(recipe.id))
        XCTAssertTrue(store.fetchAllFavorites().isEmpty)
    }

    func testFetchAllFavoritesPreservesRecipeContent() {
        let store = makeStore()
        let recipe = makeRecipe()

        store.toggleFavorite(recipe)

        let fetched = store.fetchAllFavorites().first
        XCTAssertEqual(fetched, recipe)
    }
}
