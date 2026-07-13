import SwiftUI

/// Compact recipe summary card used in horizontal/vertical recipe lists.
struct RecipeCard: View {
    let recipe: Recipe
    let imageAsset: DishImageAsset
    var isFavorite: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            DishImageView(asset: imageAsset)
                .frame(height: 120)
                .overlay(alignment: .topTrailing) {
                    if isFavorite {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(.white)
                            .padding(8)
                            .background(.black.opacity(0.25), in: Circle())
                            .padding(8)
                    }
                }

            Text(recipe.cuisineStyle.uppercased())
                .font(AppFont.caption2())
                .foregroundStyle(AppColors.primary)

            Text(recipe.name)
                .font(AppFont.headline())
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: AppSpacing.sm) {
                Label(recipe.prepTimeText, systemImage: "clock")
                Label(recipe.difficulty.displayName, systemImage: recipe.difficulty.symbolName)
                Label("\(recipe.nutrition.calories) kcal", systemImage: "flame")
            }
            .font(AppFont.caption())
            .foregroundStyle(AppColors.textSecondary)
            .lineLimit(1)

            if recipe.hasMissingIngredients {
                Text("\(recipe.missingIngredients.count) ingrédient(s) à acheter")
                    .font(AppFont.caption2())
                    .foregroundStyle(AppColors.warning)
            } else {
                Text("Tout est déjà dans votre frigo")
                    .font(AppFont.caption2())
                    .foregroundStyle(AppColors.success)
            }
        }
        .padding(AppSpacing.sm)
        .background(AppColors.card)
        .clipShape(RoundedRectangle(cornerRadius: AppRadius.medium, style: .continuous))
        .appShadow(AppShadow.subtle)
    }
}
