import SwiftUI

/// Renders whatever `DishImageAsset` a `DishImageProviding` implementation
/// returns. Today that's always a gradient + SF Symbol placeholder; if a
/// provider starts returning `remoteURL`, this view transparently switches
/// to an `AsyncImage` — no call site needs to change.
struct DishImageView: View {
    let asset: DishImageAsset
    var cornerRadius: CGFloat = AppRadius.medium

    var body: some View {
        ZStack {
            if let url = asset.remoteURL {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    default:
                        placeholder
                    }
                }
            } else {
                placeholder
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
    }

    private var placeholder: some View {
        LinearGradient(colors: asset.gradientColors, startPoint: .topLeading, endPoint: .bottomTrailing)
            .overlay {
                Image(systemName: asset.symbolName)
                    .font(.system(size: 36, weight: .medium))
                    .foregroundStyle(.white.opacity(0.9))
            }
    }
}
