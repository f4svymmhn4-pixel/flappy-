import Foundation
import Observation

@MainActor
@Observable
final class HistoryViewModel {
    private(set) var records: [AnalysisHistoryRecord] = []
    private let historyStore: HistoryStore

    init(historyStore: HistoryStore) {
        self.historyStore = historyStore
    }

    func reload() {
        records = historyStore.fetchAll()
    }

    func delete(_ record: AnalysisHistoryRecord) {
        historyStore.delete(record)
        reload()
    }
}
