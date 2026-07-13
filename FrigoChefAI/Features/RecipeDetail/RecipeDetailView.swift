import SwiftUI

/// Full recipe view: photo, quick facts, nutrition breakdown, ingredients
/// (owned vs. to-buy) and detailed preparation steps.
struct RecipeDetailView: View {
    let recipe: Recipe
    @Environment(\.dependencies) private var dependencies
    @State private var viewModel: RecipeDetailViewModel?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                hero
                quickFacts
                nutritionSection
                ingredientsSection
                stepsSection
            }
            .padding(.horizontal, AppSpacing.lg)
            .padding(.bottom, AppSpacing.xxl)
        }
        .background(AppColors.background.ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                if let viewModel {
                    FavoriteButton(isFavorite: viewModel.isFavorite) {
                        viewModel.toggleFavorite()
                    }
                }
            }
        }
        .onAppear {
            guard viewModel == nil, let dependencies else { return }
            viewModel = RecipeDetailViewModel(recipe: recipe, favoritesStore: dependencies.favoritesStore)
        }
    }

    private var hero: some View {
        DishImageView(
            asset: dependencies?.dishImageProvider.image(for: recipe)
                ?? DishImageAsset(symbolName: recipe.imageSymbol, gradientColors: [.orange, .red]),
            cornerRadius: AppRadius.large
        )
        .frame(height: 220)
        .frame(maxWidth: .infinity)
        .overlay(alignment: .bottomLeading) {
            VStack(alignment: .leading, spacing: AppSpacing.xxs) {
                Text(recipe.cuisineStyle.uppercased())
                    .font(AppFont.caption2())
                    .foregroundStyle(.white.opacity(0.85))
                Text(recipe.name)
                    .font(AppFont.title())
                    .foregroundStyle(.white)
            }
            .padding(AppSpacing.md)
        }
    }

    private var quickFacts: some View {
        HStack(spacing: AppSpacing.sm) {
            factTile(symbol: "clock", value: recipe.prepTimeText, label: "Préparation")
            factTile(symbol: recipe.difficulty.symbolName, value: recipe.difficulty.displayName, label: "Difficulté")
            factTile(symbol: "person.2.fill", value: "\(recipe.servings)", label: "Portions")
            factTile(symbol: "eurosign.circle.fill", value: recipe.costText, label: "Coût estimé")
        }
    }

    private func factTile(symbol: String, value: String, label: String) -> some View {
        VStack(spacing: AppSpacing.xxs) {
            Image(systemName: symbol).foregroundStyle(AppColors.primary)
            Text(value).font(AppFont.callout()).foregroundStyle(AppColors.textPrimary)
            Text(label).font(AppFont.caption2()).foregroundStyle(AppColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, AppSpacing.sm)
        .background(AppColors.card)
        .clipShape(RoundedRectangle(cornerRadius: AppRadius.small, style: .continuous))
    }

    private var nutritionSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            SectionHeader(title: "Valeurs nutritionnelles", symbolName: "chart.bar.fill", trailingText: "par portion")
            NutritionStatsGrid(nutrition: recipe.nutrition)
        }
    }

    private var ingredientsSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            SectionHeader(title: "Ingrédients utilisés", symbolName: "checkmark.circle.fill")
            FlowLayout(spacing: AppSpacing.xs) {
                ForEach(recipe.usedIngredients, id: \.self) { name in
                    UsedIngredientChip(name: name)
                }
            }

            if recipe.hasMissingIngredients {
                SectionHeader(title: "Ingrédients à acheter", symbolName: "cart.badge.plus")
                FlowLayout(spacing: AppSpacing.xs) {
                    ForEach(recipe.missingIngredients, id: \.self) { name in
                        MissingIngredientChip(name: name)
                    }
                }
            }
        }
    }

    private var stepsSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            SectionHeader(title: "Étapes de préparation", symbolName: "list.number")
            VStack(alignment: .leading, spacing: AppSpacing.md) {
                ForEach(recipe.steps) { step in
                    HStack(alignment: .top, spacing: AppSpacing.sm) {
                        Text("\(step.order)")
                            .font(AppFont.headline())
                            .foregroundStyle(AppColors.textOnBrand)
                            .frame(width: 28, height: 28)
                            .background(AppGradients.primaryButton, in: Circle())
                        Text(step.instruction)
                            .font(AppFont.body())
                            .foregroundStyle(AppColors.textPrimary)
                    }
                }
            }
        }
    }
}
