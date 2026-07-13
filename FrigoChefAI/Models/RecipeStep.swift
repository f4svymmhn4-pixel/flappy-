import Foundation

/// A single, detailed preparation step.
struct RecipeStep: Identifiable, Codable, Hashable {
    let id: UUID
    let order: Int
    let instruction: String

    init(id: UUID = UUID(), order: Int, instruction: String) {
        self.id = id
        self.order = order
        self.instruction = instruction
    }
}
