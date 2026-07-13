import Foundation
import SwiftData

/// SwiftData record for a saved recipe. Stores an encoded snapshot of the
/// domain `Recipe` so a favorite remains fully viewable offline even if the
/// upstream recipe catalog changes later.
@Model
final class FavoriteRecipeRecord {
    @Attribute(.unique) var id: String
    var name: String
    var dateAdded: Date
    var recipeData: Data

    init(recipe: Recipe, dateAdded: Date = .now) throws {
        id = recipe.id
        name = recipe.name
        self.dateAdded = dateAdded
        recipeData = try JSONEncoder().encode(recipe)
    }

    var recipe: Recipe? {
        try? JSONDecoder().decode(Recipe.self, from: recipeData)
    }
}

/// SwiftData record for a past fridge analysis (photo + detected ingredients
/// + generated recipes), enabling the offline history feature.
@Model
final class AnalysisHistoryRecord {
    @Attribute(.unique) var id: UUID
    var date: Date
    var imageData: Data?
    var analysisData: Data

    init(analysis: FridgeAnalysis, imageData: Data?) throws {
        id = analysis.id
        date = analysis.date
        self.imageData = imageData
        analysisData = try JSONEncoder().encode(analysis)
    }

    var analysis: FridgeAnalysis? {
        try? JSONDecoder().decode(FridgeAnalysis.self, from: analysisData)
    }
}
