import SwiftUI

/// Multi-stage animated loading view shown while the photo is analyzed and
/// recipes are generated, cycling through the copy defined by the product
/// brief: "Analyse de votre réfrigérateur…" → "Identification des
/// ingrédients…" → "Génération de recettes…".
struct AnalysisProgressView: View {
    let stage: AnalysisStage
    @State private var isPulsing = false
    @State private var rotation: Double = 0

    var body: some View {
        VStack(spacing: AppSpacing.lg) {
            ZStack {
                Circle()
                    .stroke(AppColors.primary.opacity(0.15), lineWidth: 10)
                    .frame(width: 140, height: 140)

                Circle()
                    .trim(from: 0, to: 0.25)
                    .stroke(AppGradients.primaryButton, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                    .frame(width: 140, height: 140)
                    .rotationEffect(.degrees(rotation))
                    .animation(.linear(duration: 1.1).repeatForever(autoreverses: false), value: rotation)

                Image(systemName: stage.symbolName)
                    .font(.system(size: 40, weight: .semibold))
                    .foregroundStyle(AppColors.primary)
                    .scaleEffect(isPulsing ? 1.08 : 0.94)
                    .animation(.easeInOut(duration: 0.9).repeatForever(autoreverses: true), value: isPulsing)
            }

            VStack(spacing: AppSpacing.xs) {
                Text(stage.title)
                    .font(AppFont.title3())
                    .foregroundStyle(AppColors.textPrimary)
                    .multilineTextAlignment(.center)
                    .contentTransition(.opacity)
                    .id(stage.title)
                    .transition(.opacity.combined(with: .move(edge: .bottom)))

                Text(stage.subtitle)
                    .font(AppFont.subheadline())
                    .foregroundStyle(AppColors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            HStack(spacing: AppSpacing.xs) {
                ForEach(AnalysisStage.allCases) { step in
                    Capsule()
                        .fill(step.rawValue <= stage.rawValue ? AppColors.primary : AppColors.primary.opacity(0.15))
                        .frame(width: step == stage ? 24 : 8, height: 8)
                        .animation(.easeOut(duration: 0.25), value: stage)
                }
            }
        }
        .padding(AppSpacing.xl)
        .onAppear {
            isPulsing = true
            rotation = 360
        }
    }
}

/// The three narrative stages of the analysis pipeline.
enum AnalysisStage: Int, CaseIterable, Identifiable {
    case scanningFridge = 0
    case identifyingIngredients = 1
    case generatingRecipes = 2

    var id: Int { rawValue }

    var title: String {
        switch self {
        case .scanningFridge: return "Analyse de votre réfrigérateur…"
        case .identifyingIngredients: return "Identification des ingrédients…"
        case .generatingRecipes: return "Génération de recettes…"
        }
    }

    var subtitle: String {
        switch self {
        case .scanningFridge: return "Votre photo est en cours de traitement."
        case .identifyingIngredients: return "Notre IA repère légumes, fruits, produits laitiers et plus encore."
        case .generatingRecipes: return "Des idées de repas réalistes sont en préparation."
        }
    }

    var symbolName: String {
        switch self {
        case .scanningFridge: return "refrigerator.fill"
        case .identifyingIngredients: return "magnifyingglass"
        case .generatingRecipes: return "frying.pan.fill"
        }
    }
}

#Preview {
    AnalysisProgressView(stage: .identifyingIngredients)
}
