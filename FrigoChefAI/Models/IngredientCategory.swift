import Foundation

/// All the food categories the vision analysis can classify.
enum IngredientCategory: String, Codable, CaseIterable, Identifiable {
    case vegetable
    case fruit
    case meat
    case fish
    case dairy
    case egg
    case beverage
    case sauce
    case condiment
    case butter
    case spice
    case canned
    case dessert
    case frozen
    case other

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .vegetable: return "Légume"
        case .fruit: return "Fruit"
        case .meat: return "Viande"
        case .fish: return "Poisson"
        case .dairy: return "Produit laitier"
        case .egg: return "Œuf"
        case .beverage: return "Boisson"
        case .sauce: return "Sauce"
        case .condiment: return "Condiment"
        case .butter: return "Beurre"
        case .spice: return "Épice"
        case .canned: return "Conserve"
        case .dessert: return "Dessert"
        case .frozen: return "Surgelé"
        case .other: return "Autre"
        }
    }

    var symbolName: String {
        switch self {
        case .vegetable: return "carrot.fill"
        case .fruit: return "applelogo"
        case .meat: return "fork.knife"
        case .fish: return "fish.fill"
        case .dairy: return "drop.fill"
        case .egg: return "oval.portrait.fill"
        case .beverage: return "cup.and.saucer.fill"
        case .sauce: return "drop.circle.fill"
        case .condiment: return "sparkles"
        case .butter: return "square.fill"
        case .spice: return "leaf.fill"
        case .canned: return "shippingbox.fill"
        case .dessert: return "birthday.cake.fill"
        case .frozen: return "snowflake"
        case .other: return "questionmark.circle.fill"
        }
    }
}
