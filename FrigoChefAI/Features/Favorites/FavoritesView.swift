import SwiftUI

/// Saved recipes, fully available offline since they're persisted locally
/// via SwiftData (`FavoritesStore`).
struct FavoritesView: View {
    @Environment(\.dependencies) private var dependencies
    @State private var viewModel: FavoritesViewModel?
    @State private var path = NavigationPath()

    private let columns = [GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        NavigationStack(path: $path) {
            Group {
                if let viewModel {
                    if viewModel.favorites.isEmpty {
                        EmptyStateView(
                            symbolName: "heart.text.square",
                            title: "Aucune recette enregistrée",
                            message: "Appuyez sur le cœur d'une recette pour la retrouver ici, même hors connexion."
                        )
                    } else {
                        ScrollView {
                            LazyVGrid(columns: columns, spacing: AppSpacing.sm) {
                                ForEach(viewModel.favorites) { recipe in
                                    Button {
                                        path.append(AppRoute.recipeDetail(recipe))
                                    } label: {
                                        RecipeCard(
                                            recipe: recipe,
                                            imageAsset: dependencies?.dishImageProvider.image(for: recipe)
                                                ?? DishImageAsset(symbolName: recipe.imageSymbol, gradientColors: [.orange, .red]),
                                            isFavorite: true
                                        )
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(AppSpacing.lg)
                        }
                    }
                }
            }
            .background(AppColors.background.ignoresSafeArea())
            .navigationTitle("Favoris")
            .withAppRouteDestinations(path: $path)
            .onAppear {
                if viewModel == nil, let dependencies {
                    viewModel = FavoritesViewModel(favoritesStore: dependencies.favoritesStore)
                }
                viewModel?.reload()
            }
        }
    }
}
