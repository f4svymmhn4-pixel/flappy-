import SwiftUI

/// Toggleable pill used to build the dietary filter picker.
struct FilterChip: View {
    let filter: DietaryFilter
    let isSelected: Bool
    var action: () -> Void = {}

    var body: some View {
        Button(action: action) {
            Label(filter.displayName, systemImage: filter.symbolName)
                .font(AppFont.callout())
                .padding(.horizontal, AppSpacing.md)
                .padding(.vertical, AppSpacing.xs)
                .foregroundStyle(isSelected ? AppColors.textOnBrand : AppColors.textPrimary)
                .background(isSelected ? AnyShapeStyle(AppGradients.primaryButton) : AnyShapeStyle(AppColors.card))
                .clipShape(Capsule())
                .overlay(
                    Capsule().stroke(isSelected ? .clear : Color.gray.opacity(0.25), lineWidth: 1)
                )
        }
        .buttonStyle(.plain)
        .animation(.easeOut(duration: 0.15), value: isSelected)
    }
}
