import SwiftUI

/// Maps an `AppRoute` to its destination screen. Shared by every tab so
/// `.navigationDestination(for: AppRoute.self)` stays a one-liner everywhere.
struct RouteDestinationView: View {
    let route: AppRoute
    @Binding var path: NavigationPath

    var body: some View {
        switch route {
        case .analysis(let imageData):
            AnalysisView(imageData: imageData, path: $path)
        case .results(let analysis):
            ResultsView(analysis: analysis, path: $path)
        case .recipeDetail(let recipe):
            RecipeDetailView(recipe: recipe)
        }
    }
}

extension View {
    /// Registers the standard `AppRoute` navigation destinations for this stack.
    func withAppRouteDestinations(path: Binding<NavigationPath>) -> some View {
        navigationDestination(for: AppRoute.self) { route in
            RouteDestinationView(route: route, path: path)
        }
    }
}
