import Foundation
import Observation

@MainActor
@Observable
final class FavoritesViewModel {
    private(set) var favorites: [Recipe] = []
    private let favoritesStore: FavoritesStore

    init(favoritesStore: FavoritesStore) {
        self.favoritesStore = favoritesStore
    }

    func reload() {
        favorites = favoritesStore.fetchAllFavorites()
    }

    func remove(_ recipe: Recipe) {
        favoritesStore.toggleFavorite(recipe)
        reload()
    }
}
