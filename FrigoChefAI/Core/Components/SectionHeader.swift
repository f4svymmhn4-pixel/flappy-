import SwiftUI

/// Consistent header for a horizontal/vertical recipe section
/// (e.g. "Déjeuner" with a "5 idées" trailing count).
struct SectionHeader: View {
    let title: String
    let symbolName: String
    var trailingText: String?

    var body: some View {
        HStack {
            Label(title, systemImage: symbolName)
                .font(AppFont.title3())
                .foregroundStyle(AppColors.textPrimary)
            Spacer()
            if let trailingText {
                Text(trailingText)
                    .font(AppFont.caption())
                    .foregroundStyle(AppColors.textSecondary)
            }
        }
    }
}
