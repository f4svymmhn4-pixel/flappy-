import Foundation

/// User-facing filters that can be applied to the generated recipe list.
enum DietaryFilter: String, Codable, CaseIterable, Identifiable {
    case highProtein
    case lowCalorie
    case bulking
    case weightLoss
    case vegetarian
    case vegan
    case lactoseFree
    case glutenFree
    case quick
    case economical
    case gourmet

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .highProtein: return "Riche en protéines"
        case .lowCalorie: return "Faible en calories"
        case .bulking: return "Prise de masse"
        case .weightLoss: return "Perte de poids"
        case .vegetarian: return "Végétarien"
        case .vegan: return "Vegan"
        case .lactoseFree: return "Sans lactose"
        case .glutenFree: return "Sans gluten"
        case .quick: return "Rapide (< 15 min)"
        case .economical: return "Économique"
        case .gourmet: return "Gourmand"
        }
    }

    var symbolName: String {
        switch self {
        case .highProtein: return "bolt.fill"
        case .lowCalorie: return "leaf.fill"
        case .bulking: return "figure.strengthtraining.traditional"
        case .weightLoss: return "figure.run"
        case .vegetarian: return "carrot.fill"
        case .vegan: return "leaf.circle.fill"
        case .lactoseFree: return "drop.triangle.fill"
        case .glutenFree: return "checkmark.seal.fill"
        case .quick: return "timer"
        case .economical: return "eurosign.circle.fill"
        case .gourmet: return "crown.fill"
        }
    }

    /// Evaluates whether a recipe (represented generically here to avoid a
    /// circular dependency) satisfies this filter. See `Recipe.matches(filter:)`.
    var thresholdDescription: String {
        switch self {
        case .highProtein: return "≥ 20 g de protéines"
        case .lowCalorie: return "≤ 450 kcal"
        case .bulking: return "≥ 500 kcal"
        case .weightLoss: return "≤ 400 kcal"
        case .quick: return "≤ 15 min de préparation"
        case .economical: return "≤ 4 € par portion"
        default: return displayName
        }
    }
}
