import SwiftUI

/// Full-screen animated loading experience shown while the photo is
/// analyzed and recipes are generated.
struct AnalysisView: View {
    let imageData: Data
    @Binding var path: NavigationPath

    @Environment(\.dependencies) private var dependencies
    @State private var viewModel: AnalysisViewModel?

    var body: some View {
        ZStack {
            AppColors.background.ignoresSafeArea()

            if let viewModel {
                switch viewModel.state {
                case .running:
                    AnalysisProgressView(stage: viewModel.stage)
                case .failed(let message):
                    EmptyStateView(
                        symbolName: "exclamationmark.triangle.fill",
                        title: "Analyse impossible",
                        message: message,
                        actionTitle: "Réessayer"
                    ) {
                        Task { await viewModel.start() }
                    }
                }
            }
        }
        .navigationBarBackButtonHidden(viewModel?.state == .running)
        .task {
            guard let dependencies, viewModel == nil else { return }
            let model = AnalysisViewModel(imageData: imageData, dependencies: dependencies)
            viewModel = model
            await model.start()
        }
        .onChange(of: viewModel?.completedAnalysis) { _, analysis in
            guard let analysis else { return }
            path.append(AppRoute.results(analysis))
        }
    }
}
