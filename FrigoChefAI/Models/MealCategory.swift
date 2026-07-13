import Foundation

/// The meal categories the recipe generator organizes results into,
/// each with a target number of ideas as specified by the product brief.
enum MealCategory: String, Codable, CaseIterable, Identifiable {
    case breakfast
    case lunch
    case dinner
    case afternoonSnack // "Goûter"
    case snack
    case dessert

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .breakfast: return "Petit-déjeuner"
        case .lunch: return "Déjeuner"
        case .dinner: return "Dîner"
        case .afternoonSnack: return "Goûter"
        case .snack: return "Snack"
        case .dessert: return "Dessert"
        }
    }

    var symbolName: String {
        switch self {
        case .breakfast: return "sunrise.fill"
        case .lunch: return "sun.max.fill"
        case .dinner: return "moon.stars.fill"
        case .afternoonSnack: return "cup.and.saucer.fill"
        case .snack: return "takeoutbag.and.cup.and.straw.fill"
        case .dessert: return "birthday.cake.fill"
        }
    }

    /// Target number of recipe ideas to generate for this category,
    /// as defined in the product brief (3/5/5/3/3/3).
    var targetRecipeCount: Int {
        switch self {
        case .breakfast: return 3
        case .lunch: return 5
        case .dinner: return 5
        case .afternoonSnack: return 3
        case .snack: return 3
        case .dessert: return 3
        }
    }

    /// Display order on the results screen.
    static var orderedCases: [MealCategory] {
        [.breakfast, .lunch, .dinner, .afternoonSnack, .snack, .dessert]
    }
}
