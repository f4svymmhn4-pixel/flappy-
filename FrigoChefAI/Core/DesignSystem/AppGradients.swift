import SwiftUI

/// Reusable gradients for hero surfaces, buttons and dish placeholders.
enum AppGradients {
    static let heroBackground = LinearGradient(
        colors: [Color(hex: "FFF4E8"), Color(hex: "FFE3D1")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let heroBackgroundDark = LinearGradient(
        colors: [Color(hex: "241A14"), Color(hex: "1A1210")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let primaryButton = LinearGradient(
        colors: [Color(hex: "FF7A59"), Color(hex: "FF5A3C")],
        startPoint: .leading,
        endPoint: .trailing
    )

    static let secondaryButton = LinearGradient(
        colors: [Color(hex: "3FA796"), Color(hex: "2E8B7C")],
        startPoint: .leading,
        endPoint: .trailing
    )

    /// A deterministic gradient generator used for dish placeholders,
    /// so the same recipe always renders the same colors.
    static func dish(from hexColors: [String]) -> LinearGradient {
        let colors = hexColors.isEmpty ? ["FF9966", "FF5E62"] : hexColors
        return LinearGradient(
            colors: colors.map { Color(hex: $0) },
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}
