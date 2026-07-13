import SwiftUI

/// Pill displaying a detected ingredient's name and confidence level,
/// e.g. "Tomates · 95%".
struct IngredientChip: View {
    let ingredient: DetectedIngredient

    var body: some View {
        HStack(spacing: AppSpacing.xxs) {
            Image(systemName: ingredient.category.symbolName)
                .font(.caption)
            Text(ingredient.name)
                .font(AppFont.callout())
            Text(ingredient.confidencePercentText)
                .font(AppFont.caption2())
                .foregroundStyle(AppColors.confidenceColor(ingredient.confidence))
        }
        .padding(.horizontal, AppSpacing.sm)
        .padding(.vertical, AppSpacing.xs)
        .background(AppColors.card)
        .clipShape(Capsule())
        .overlay(
            Capsule().stroke(AppColors.confidenceColor(ingredient.confidence).opacity(0.35), lineWidth: 1)
        )
    }
}

/// Small tag confirming an ingredient the recipe uses is already on hand.
struct UsedIngredientChip: View {
    let name: String

    var body: some View {
        HStack(spacing: AppSpacing.xxs) {
            Image(systemName: "checkmark.circle.fill")
                .font(.caption)
            Text(name.capitalized)
                .font(AppFont.callout())
        }
        .padding(.horizontal, AppSpacing.sm)
        .padding(.vertical, AppSpacing.xs)
        .foregroundStyle(AppColors.success)
        .background(AppColors.success.opacity(0.12))
        .clipShape(Capsule())
    }
}

/// Small tag listing a missing ingredient the user needs to buy.
struct MissingIngredientChip: View {
    let name: String

    var body: some View {
        HStack(spacing: AppSpacing.xxs) {
            Image(systemName: "cart.badge.plus")
                .font(.caption)
            Text(name.capitalized)
                .font(AppFont.callout())
        }
        .padding(.horizontal, AppSpacing.sm)
        .padding(.vertical, AppSpacing.xs)
        .foregroundStyle(AppColors.warning)
        .background(AppColors.warning.opacity(0.12))
        .clipShape(Capsule())
    }
}
