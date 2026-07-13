import Foundation
import Observation

/// Orchestrates the vision analysis → recipe generation pipeline and
/// publishes which narrative stage is currently active, so the UI can stay
/// a simple, dumb reflection of state.
@MainActor
@Observable
final class AnalysisViewModel {
    enum State: Equatable {
        case running
        case failed(String)
    }

    private(set) var stage: AnalysisStage = .scanningFridge
    private(set) var state: State = .running
    private(set) var completedAnalysis: FridgeAnalysis?

    private let imageData: Data
    private let dependencies: AppDependencies

    init(imageData: Data, dependencies: AppDependencies) {
        self.imageData = imageData
        self.dependencies = dependencies
    }

    func start() async {
        state = .running
        stage = .scanningFridge

        do {
            // Lets the first stage be visible for a moment before the "network" call fires.
            try await Task.sleep(for: .seconds(0.4))

            stage = .identifyingIngredients
            let ingredients = try await dependencies.visionAnalysisService.analyzeFridgeImage(imageData)

            stage = .generatingRecipes
            let recipesByCategory = try await dependencies.recipeGenerationService.generateRecipes(
                from: ingredients,
                filters: []
            )

            let analysis = FridgeAnalysis(detectedIngredients: ingredients, recipesByCategory: recipesByCategory)
            dependencies.historyStore.save(analysis, imageData: imageData)
            completedAnalysis = analysis
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}
