import Foundation
import SwiftData

/// Persists every completed fridge analysis so past results (ingredients +
/// generated recipes) remain browsable offline, oldest entries pruned
/// automatically beyond `historyLimit`.
@MainActor
final class HistoryStore {
    private let modelContext: ModelContext
    private let historyLimit = 30

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    func save(_ analysis: FridgeAnalysis, imageData: Data?) {
        guard let record = try? AnalysisHistoryRecord(analysis: analysis, imageData: imageData) else { return }
        modelContext.insert(record)
        try? modelContext.save()
        trimIfNeeded()
    }

    func fetchAll() -> [AnalysisHistoryRecord] {
        let descriptor = FetchDescriptor<AnalysisHistoryRecord>(
            sortBy: [SortDescriptor(\.date, order: .reverse)]
        )
        return (try? modelContext.fetch(descriptor)) ?? []
    }

    func delete(_ record: AnalysisHistoryRecord) {
        modelContext.delete(record)
        try? modelContext.save()
    }

    private func trimIfNeeded() {
        let all = fetchAll()
        guard all.count > historyLimit else { return }
        for record in all.suffix(from: historyLimit) {
            modelContext.delete(record)
        }
        try? modelContext.save()
    }
}
