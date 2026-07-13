import SwiftUI

/// Shows everything detected in the fridge photo plus the generated recipe
/// ideas, grouped by meal category, with a filters entry point.
struct ResultsView: View {
    @Binding var path: NavigationPath
    @Environment(\.dependencies) private var dependencies
    @State private var viewModel: ResultsViewModel

    init(analysis: FridgeAnalysis, path: Binding<NavigationPath>) {
        _path = path
        _viewModel = State(initialValue: ResultsViewModel(analysis: analysis))
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                ingredientsSection

                if viewModel.hasAnyVisibleRecipe {
                    ForEach(MealCategory.orderedCases) { category in
                        let recipes = viewModel.recipes(for: category)
                        if !recipes.isEmpty {
                            recipeSection(category: category, recipes: recipes)
                        }
                    }
                } else {
                    EmptyStateView(
                        symbolName: "line.3.horizontal.decrease.circle",
                        title: "Aucune recette ne correspond",
                        message: "Essayez de retirer un ou plusieurs filtres.",
                        actionTitle: "Réinitialiser les filtres"
                    ) {
                        viewModel.activeFilters.removeAll()
                    }
                }
            }
            .padding(AppSpacing.lg)
        }
        .background(AppColors.background.ignoresSafeArea())
        .navigationTitle("Vos recettes")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    viewModel.isFiltersPresented = true
                } label: {
                    Image(systemName: "slider.horizontal.3")
                        .overlay(alignment: .topTrailing) {
                            if !viewModel.activeFilters.isEmpty {
                                Circle().fill(AppColors.primary).frame(width: 8, height: 8).offset(x: 6, y: -4)
                            }
                        }
                }
            }
        }
        .sheet(isPresented: $viewModel.isFiltersPresented) {
            FiltersView(selectedFilters: $viewModel.activeFilters)
        }
    }

    private var ingredientsSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            SectionHeader(
                title: "Ingrédients détectés",
                symbolName: "checklist",
                trailingText: "\(viewModel.analysis.detectedIngredients.count)"
            )
            FlowLayout(spacing: AppSpacing.xs) {
                ForEach(viewModel.analysis.detectedIngredients) { ingredient in
                    IngredientChip(ingredient: ingredient)
                }
            }
        }
    }

    private func recipeSection(category: MealCategory, recipes: [Recipe]) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            SectionHeader(
                title: category.displayName,
                symbolName: category.symbolName,
                trailingText: "\(recipes.count) idée\(recipes.count > 1 ? "s" : "")"
            )
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: AppSpacing.sm) {
                    ForEach(recipes) { recipe in
                        Button {
                            path.append(AppRoute.recipeDetail(recipe))
                        } label: {
                            RecipeCard(
                                recipe: recipe,
                                imageAsset: dependencies?.dishImageProvider.image(for: recipe)
                                    ?? DishImageAsset(symbolName: recipe.imageSymbol, gradientColors: [.orange, .red]),
                                isFavorite: dependencies?.favoritesStore.isFavorite(recipe.id) ?? false
                            )
                            .frame(width: 220)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }
}
