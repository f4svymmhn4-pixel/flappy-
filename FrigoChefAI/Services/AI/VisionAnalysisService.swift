import Foundation

/// Abstraction over "what looks at a fridge photo and returns ingredients".
/// Swap `MockVisionAnalysisService` for a real provider (GPT-4.1 Vision,
/// GPT-5 Vision, Claude Vision, a custom model, ...) by conforming to this
/// protocol — nothing else in the app needs to change.
protocol VisionAnalysisServiceProtocol {
    func analyzeFridgeImage(_ imageData: Data) async throws -> [DetectedIngredient]
}

enum VisionAnalysisError: LocalizedError {
    case invalidImage
    case networkUnavailable
    case providerFailure(String)

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Impossible de lire cette photo. Essayez une autre image."
        case .networkUnavailable:
            return "Connexion indisponible. Vérifiez votre réseau et réessayez."
        case .providerFailure(let message):
            return message
        }
    }
}

/// Development/offline implementation: simulates a vision model by drawing a
/// realistic, randomized subset of ingredients from a bundled catalog, each
/// with a plausible confidence score. Keeps the app fully usable without any
/// API key while the real provider is being integrated.
final class MockVisionAnalysisService: VisionAnalysisServiceProtocol {
    private let catalog: [CatalogIngredient]

    init(bundle: Bundle = .main) {
        catalog = Self.loadCatalog(bundle: bundle)
    }

    func analyzeFridgeImage(_ imageData: Data) async throws -> [DetectedIngredient] {
        guard !imageData.isEmpty else { throw VisionAnalysisError.invalidImage }
        guard !catalog.isEmpty else { throw VisionAnalysisError.providerFailure("Catalogue d'ingrédients introuvable.") }

        // Simulates network + inference latency so the multi-stage loading
        // animation has time to play out.
        try await Task.sleep(for: .seconds(1.3))

        let count = Int.random(in: 12...20)
        let picked = catalog.shuffled().prefix(min(count, catalog.count))

        return picked
            .map { item in
                DetectedIngredient(
                    name: item.name,
                    category: item.category,
                    confidence: Double.random(in: 0.62...0.99)
                )
            }
            .sorted { $0.confidence > $1.confidence }
    }

    private static func loadCatalog(bundle: Bundle) -> [CatalogIngredient] {
        guard
            let url = bundle.url(forResource: "ingredients_catalog", withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let items = try? JSONDecoder().decode([CatalogIngredient].self, from: data)
        else { return [] }
        return items
    }
}

private struct CatalogIngredient: Codable {
    let name: String
    let category: IngredientCategory
}
