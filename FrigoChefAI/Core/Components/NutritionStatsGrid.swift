import SwiftUI

/// Grid of nutrition facts shown on the recipe detail screen.
struct NutritionStatsGrid: View {
    let nutrition: NutritionInfo

    private var stats: [(label: String, value: String, symbol: String)] {
        [
            ("Calories", "\(nutrition.calories) kcal", "flame.fill"),
            ("Protéines", "\(Int(nutrition.proteinG)) g", "bolt.fill"),
            ("Glucides", "\(Int(nutrition.carbsG)) g", "leaf.fill"),
            ("Lipides", "\(Int(nutrition.fatG)) g", "drop.fill"),
            ("Fibres", "\(Int(nutrition.fiberG)) g", "circle.grid.cross.fill"),
            ("Sucres", "\(Int(nutrition.sugarG)) g", "cube.fill"),
            ("Sodium", "\(Int(nutrition.sodiumMg)) mg", "aqi.medium"),
        ]
    }

    private let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        LazyVGrid(columns: columns, spacing: AppSpacing.sm) {
            ForEach(stats, id: \.label) { stat in
                VStack(spacing: AppSpacing.xxs) {
                    Image(systemName: stat.symbol)
                        .foregroundStyle(AppColors.primary)
                    Text(stat.value)
                        .font(AppFont.headline())
                        .foregroundStyle(AppColors.textPrimary)
                    Text(stat.label)
                        .font(AppFont.caption2())
                        .foregroundStyle(AppColors.textSecondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, AppSpacing.sm)
                .background(AppColors.card)
                .clipShape(RoundedRectangle(cornerRadius: AppRadius.small, style: .continuous))
            }
        }
    }
}
