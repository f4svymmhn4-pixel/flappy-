import Foundation

/// A single ingredient identified by the vision analysis, with a confidence score.
struct DetectedIngredient: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let category: IngredientCategory
    /// Confidence in the range 0.0...1.0, e.g. 0.95 == 95%.
    let confidence: Double

    init(id: UUID = UUID(), name: String, category: IngredientCategory, confidence: Double) {
        self.id = id
        self.name = name
        self.category = category
        self.confidence = confidence
    }

    var confidencePercentText: String {
        "\(Int((confidence * 100).rounded()))%"
    }

    /// Normalized name used for matching against recipe ingredient requirements
    /// (lowercased, accents kept since recipes are in French, trimmed).
    var normalizedName: String {
        name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    }
}
