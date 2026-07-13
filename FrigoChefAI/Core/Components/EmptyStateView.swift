import SwiftUI

/// Friendly empty/error state used across Favorites, History and Results
/// when there is nothing to show.
struct EmptyStateView: View {
    let symbolName: String
    let title: String
    let message: String
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: AppSpacing.md) {
            Image(systemName: symbolName)
                .font(.system(size: 44, weight: .medium))
                .foregroundStyle(AppColors.primary)
                .padding(AppSpacing.lg)
                .background(AppColors.primary.opacity(0.1), in: Circle())

            Text(title)
                .font(AppFont.title3())
                .foregroundStyle(AppColors.textPrimary)
                .multilineTextAlignment(.center)

            Text(message)
                .font(AppFont.subheadline())
                .foregroundStyle(AppColors.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, AppSpacing.lg)

            if let actionTitle, let action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(AppFont.headline())
                        .foregroundStyle(AppColors.textOnBrand)
                        .padding(.horizontal, AppSpacing.lg)
                        .padding(.vertical, AppSpacing.sm)
                        .background(AppGradients.primaryButton)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .padding(.top, AppSpacing.xs)
            }
        }
        .padding(AppSpacing.xl)
        .frame(maxWidth: .infinity)
    }
}
