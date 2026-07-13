import Foundation
import SwiftUI

/// Central color palette for FrigoChef AI.
/// Warm, appetizing tones (coral / peach / fresh green) inspired by modern food apps,
/// with full Light/Dark Mode support via named colors defined in Assets.xcassets where possible
/// and computed dynamic colors here for anything generated at runtime.
enum AppColors {
    // Brand
    static let primary = Color("BrandPrimary", bundle: .main)
    static let primaryDark = Color("BrandPrimaryDark", bundle: .main)
    static let secondary = Color("BrandSecondary", bundle: .main)

    // Surfaces
    static let background = Color("SurfaceBackground", bundle: .main)
    static let card = Color("SurfaceCard", bundle: .main)
    static let cardElevated = Color("SurfaceCardElevated", bundle: .main)

    // Text
    static let textPrimary = Color("TextPrimary", bundle: .main)
    static let textSecondary = Color("TextSecondary", bundle: .main)
    static let textOnBrand = Color.white

    // Semantic
    static let success = Color("SemanticSuccess", bundle: .main)
    static let warning = Color("SemanticWarning", bundle: .main)
    static let danger = Color("SemanticDanger", bundle: .main)

    // Confidence levels for ingredient detection badges
    static func confidenceColor(_ value: Double) -> Color {
        switch value {
        case 0.85...: return success
        case 0.6..<0.85: return warning
        default: return danger
        }
    }
}

extension Color {
    /// Convenience initializer from a hex string like "#FF7A59" or "FF7A59".
    init(hex: String) {
        let sanitized = hex.trimmingCharacters(in: .alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: sanitized).scanHexInt64(&value)
        let r = Double((value >> 16) & 0xFF) / 255
        let g = Double((value >> 8) & 0xFF) / 255
        let b = Double(value & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
