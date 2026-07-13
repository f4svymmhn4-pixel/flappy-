import Foundation
import SwiftData

/// Manages saved recipes so the user can revisit them without re-scanning
/// their fridge, including fully offline.
@MainActor
final class FavoritesStore {
    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    func isFavorite(_ recipeID: String) -> Bool {
        fetchRecord(recipeID) != nil
    }

    func toggleFavorite(_ recipe: Recipe) {
        if let existing = fetchRecord(recipe.id) {
            modelContext.delete(existing)
        } else if let record = try? FavoriteRecipeRecord(recipe: recipe) {
            modelContext.insert(record)
        }
        try? modelContext.save()
    }

    func fetchAllFavorites() -> [Recipe] {
        let descriptor = FetchDescriptor<FavoriteRecipeRecord>(
            sortBy: [SortDescriptor(\.dateAdded, order: .reverse)]
        )
        let records = (try? modelContext.fetch(descriptor)) ?? []
        return records.compactMap(\.recipe)
    }

    private func fetchRecord(_ recipeID: String) -> FavoriteRecipeRecord? {
        var descriptor = FetchDescriptor<FavoriteRecipeRecord>(
            predicate: #Predicate { $0.id == recipeID }
        )
        descriptor.fetchLimit = 1
        return try? modelContext.fetch(descriptor).first
    }
}
