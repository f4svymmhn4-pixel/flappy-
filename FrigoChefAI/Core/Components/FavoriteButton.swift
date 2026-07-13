import SwiftUI

/// Animated heart toggle used on the recipe detail screen.
struct FavoriteButton: View {
    let isFavorite: Bool
    var action: () -> Void = {}

    var body: some View {
        Button(action: action) {
            Image(systemName: isFavorite ? "heart.fill" : "heart")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(isFavorite ? Color.red : AppColors.textPrimary)
                .padding(AppSpacing.sm)
                .background(AppColors.card, in: Circle())
                .appShadow(AppShadow.subtle)
                .scaleEffect(isFavorite ? 1.05 : 1)
        }
        .buttonStyle(.plain)
        .animation(.spring(response: 0.3, dampingFraction: 0.55), value: isFavorite)
    }
}
