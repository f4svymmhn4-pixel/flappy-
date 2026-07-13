import Foundation

/// Push-navigation destinations shared by every tab's `NavigationStack`.
/// Not every tab uses every case (Favorites/History only ever push
/// `.recipeDetail`), but a single shared enum keeps `RecipeDetailView`
/// reachable from anywhere in the app.
enum AppRoute: Hashable {
    case analysis(imageData: Data)
    case results(FridgeAnalysis)
    case recipeDetail(Recipe)
}
