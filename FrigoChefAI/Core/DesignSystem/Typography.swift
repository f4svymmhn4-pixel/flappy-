import SwiftUI

/// App-wide typography scale built on the rounded SF Pro design,
/// giving the app a friendly, "food app" personality while staying native.
enum AppFont {
    static func largeTitle() -> Font { .system(.largeTitle, design: .rounded, weight: .bold) }
    static func title() -> Font { .system(.title2, design: .rounded, weight: .bold) }
    static func title3() -> Font { .system(.title3, design: .rounded, weight: .semibold) }
    static func headline() -> Font { .system(.headline, design: .rounded, weight: .semibold) }
    static func body() -> Font { .system(.body, design: .rounded, weight: .regular) }
    static func callout() -> Font { .system(.callout, design: .rounded, weight: .medium) }
    static func subheadline() -> Font { .system(.subheadline, design: .rounded, weight: .regular) }
    static func caption() -> Font { .system(.caption, design: .rounded, weight: .medium) }
    static func caption2() -> Font { .system(.caption2, design: .rounded, weight: .semibold) }
}

/// Standardized spacing & radii so every screen shares the same rhythm.
enum AppSpacing {
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}

enum AppRadius {
    static let small: CGFloat = 12
    static let medium: CGFloat = 20
    static let large: CGFloat = 28
    static let pill: CGFloat = 999
}

enum AppShadow {
    static let card = Shadow(color: .black.opacity(0.08), radius: 16, x: 0, y: 8)
    static let subtle = Shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)

    struct Shadow {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }
}

extension View {
    func appShadow(_ shadow: AppShadow.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}
