import SwiftData

/// Builds the single SwiftData `ModelContainer` used across the app.
enum PersistenceController {
    static func makeContainer(inMemory: Bool = false) -> ModelContainer {
        let schema = Schema([FavoriteRecipeRecord.self, AnalysisHistoryRecord.self])
        let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: inMemory)
        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Impossible d'initialiser le stockage local: \(error)")
        }
    }
}
