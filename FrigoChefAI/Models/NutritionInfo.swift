import Foundation

/// Estimated nutritional values for a recipe, per serving.
struct NutritionInfo: Codable, Hashable {
    let calories: Int
    let proteinG: Double
    let carbsG: Double
    let fatG: Double
    let fiberG: Double
    let sugarG: Double
    let sodiumMg: Double
}
