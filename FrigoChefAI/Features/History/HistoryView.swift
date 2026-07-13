import SwiftUI
import UIKit

/// Past fridge analyses, persisted locally so results remain browsable
/// offline (product requirement: "Mode hors connexion pour consulter les
/// recettes enregistrées").
struct HistoryView: View {
    @Environment(\.dependencies) private var dependencies
    @State private var viewModel: HistoryViewModel?
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            Group {
                if let viewModel {
                    if viewModel.records.isEmpty {
                        EmptyStateView(
                            symbolName: "clock.arrow.circlepath",
                            title: "Aucun historique",
                            message: "Vos analyses de frigo apparaîtront ici, consultables même sans connexion."
                        )
                    } else {
                        List {
                            ForEach(viewModel.records) { record in
                                if let analysis = record.analysis {
                                    Button {
                                        path.append(AppRoute.results(analysis))
                                    } label: {
                                        HistoryRow(record: record, analysis: analysis)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .onDelete { offsets in
                                for index in offsets {
                                    viewModel.delete(viewModel.records[index])
                                }
                            }
                        }
                        .listStyle(.plain)
                    }
                }
            }
            .background(AppColors.background.ignoresSafeArea())
            .navigationTitle("Historique")
            .withAppRouteDestinations(path: $path)
            .onAppear {
                if viewModel == nil, let dependencies {
                    viewModel = HistoryViewModel(historyStore: dependencies.historyStore)
                }
                viewModel?.reload()
            }
        }
    }
}

private struct HistoryRow: View {
    let record: AnalysisHistoryRecord
    let analysis: FridgeAnalysis

    var body: some View {
        HStack(spacing: AppSpacing.sm) {
            thumbnail
            VStack(alignment: .leading, spacing: AppSpacing.xxs) {
                Text(analysis.date.formatted(date: .abbreviated, time: .shortened))
                    .font(AppFont.headline())
                    .foregroundStyle(AppColors.textPrimary)
                Text("\(analysis.detectedIngredients.count) ingrédients · \(analysis.totalRecipeCount) recettes")
                    .font(AppFont.caption())
                    .foregroundStyle(AppColors.textSecondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundStyle(AppColors.textSecondary)
        }
        .padding(.vertical, AppSpacing.xxs)
    }

    @ViewBuilder
    private var thumbnail: some View {
        if let data = record.imageData, let uiImage = UIImage(data: data) {
            Image(uiImage: uiImage)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 52, height: 52)
                .clipShape(RoundedRectangle(cornerRadius: AppRadius.small, style: .continuous))
        } else {
            RoundedRectangle(cornerRadius: AppRadius.small, style: .continuous)
                .fill(AppGradients.dish(from: ["FF9966", "FF5E62"]))
                .frame(width: 52, height: 52)
                .overlay {
                    Image(systemName: "refrigerator.fill").foregroundStyle(.white)
                }
        }
    }
}
