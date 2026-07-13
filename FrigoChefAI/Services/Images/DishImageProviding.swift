import SwiftUI

/// Visual asset for a dish: either a system-symbol + gradient placeholder
/// (used today) or, once swapped in, a remote/generated photo URL.
struct DishImageAsset {
    let symbolName: String
    let gradientColors: [Color]
    let remoteURL: URL?

    init(symbolName: String, gradientColors: [Color], remoteURL: URL? = nil) {
        self.symbolName = symbolName
        self.gradientColors = gradientColors
        self.remoteURL = remoteURL
    }
}

/// Abstraction over "how do we get a picture for this dish". Implementations
/// can source images from stock-photo APIs (e.g. Unsplash), an AI image
/// generator (e.g. DALL-E), a curated culinary photo database, or — as here —
/// a stylized local placeholder. `DishImageView` renders whichever asset it
/// receives without knowing the source.
protocol DishImageProviding {
    func image(for recipe: Recipe) -> DishImageAsset
}

/// Default implementation: no network calls, no cost. Derives a deterministic
/// SF Symbol + gradient from the recipe's own metadata so the same recipe
/// always looks the same.
final class PlaceholderDishImageProvider: DishImageProviding {
    func image(for recipe: Recipe) -> DishImageAsset {
        DishImageAsset(
            symbolName: recipe.imageSymbol,
            gradientColors: [Color(hex: recipe.gradientStart), Color(hex: recipe.gradientEnd)]
        )
    }
}
