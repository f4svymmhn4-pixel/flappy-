import SwiftUI

enum RecipeDifficulty: String, Codable, CaseIterable {
    case easy
    case medium
    case hard

    var displayName: String {
        switch self {
        case .easy: return "Facile"
        case .medium: return "Moyen"
        case .hard: return "Difficile"
        }
    }

    var symbolName: String {
        switch self {
        case .easy: return "star.fill"
        case .medium: return "star.leadinghalf.filled"
        case .hard: return "flame.fill"
        }
    }

    var tintColor: Color {
        switch self {
        case .easy: return AppColors.success
        case .medium: return AppColors.warning
        case .hard: return AppColors.danger
        }
    }
}
