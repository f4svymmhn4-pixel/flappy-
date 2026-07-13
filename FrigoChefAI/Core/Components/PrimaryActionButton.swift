import SwiftUI

/// Visual content shared by `PrimaryActionButton` (a plain `Button`) and any
/// non-`Button` control that needs the identical look, such as a
/// `PhotosPicker` label.
struct PrimaryActionButtonLabel: View {
    let title: String
    let symbolName: String
    var gradient: LinearGradient = AppGradients.primaryButton

    var body: some View {
        VStack(spacing: AppSpacing.sm) {
            Image(systemName: symbolName)
                .font(.system(size: 32, weight: .semibold))
            Text(title)
                .font(AppFont.headline())
        }
        .foregroundStyle(AppColors.textOnBrand)
        .frame(maxWidth: .infinity)
        .padding(.vertical, AppSpacing.lg)
        .background(gradient)
        .clipShape(RoundedRectangle(cornerRadius: AppRadius.large, style: .continuous))
        .appShadow(AppShadow.card)
    }
}

/// Large gradient call-to-action button used for the two hero actions on the
/// Home screen ("Prendre une photo" / "Choisir une photo") and elsewhere.
struct PrimaryActionButton: View {
    let title: String
    let symbolName: String
    var gradient: LinearGradient = AppGradients.primaryButton
    var action: () -> Void = {}

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            PrimaryActionButtonLabel(title: title, symbolName: symbolName, gradient: gradient)
                .scaleEffect(isPressed ? 0.97 : 1)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in withAnimation(.easeOut(duration: 0.15)) { isPressed = true } }
                .onEnded { _ in withAnimation(.easeOut(duration: 0.15)) { isPressed = false } }
        )
    }
}

#Preview {
    VStack(spacing: 16) {
        PrimaryActionButton(title: "Prendre une photo", symbolName: "camera.fill") {}
        PrimaryActionButton(
            title: "Choisir une photo",
            symbolName: "photo.on.rectangle",
            gradient: AppGradients.secondaryButton
        ) {}
    }
    .padding()
}
