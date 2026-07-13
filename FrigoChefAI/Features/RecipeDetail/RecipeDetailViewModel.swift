import Foundation
import Observation

@MainActor
@Observable
final class RecipeDetailViewModel {
    let recipe: Recipe
    private let favoritesStore: FavoritesStore
    private(set) var isFavorite: Bool

    init(recipe: Recipe, favoritesStore: FavoritesStore) {
        self.recipe = recipe
        self.favoritesStore = favoritesStore
        isFavorite = favoritesStore.isFavorite(recipe.id)
    }

    func toggleFavorite() {
        favoritesStore.toggleFavorite(recipe)
        isFavorite.toggle()
    }
}
