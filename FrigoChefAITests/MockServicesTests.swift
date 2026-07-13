import XCTest
@testable import FrigoChefAI

final class MockServicesTests: XCTestCase {
    private var bundle: Bundle { Bundle(for: MockServicesTests.self) }

    func testVisionServiceRejectsEmptyData() async {
        let service = MockVisionAnalysisService(bundle: bundle)
        do {
            _ = try await service.analyzeFridgeImage(Data())
            XCTFail("Expected invalidImage error for empty data")
        } catch let error as VisionAnalysisError {
            XCTAssertEqual(error.errorDescription, VisionAnalysisError.invalidImage.errorDescription)
        } catch {
            XCTFail("Unexpected error type: \(error)")
        }
    }

    func testVisionServiceReturnsRealisticSubset() async throws {
        let service = MockVisionAnalysisService(bundle: bundle)
        let ingredients = try await service.analyzeFridgeImage(Data([0xFF, 0xD8, 0xFF]))

        XCTAssertGreaterThanOrEqual(ingredients.count, 12)
        XCTAssertLessThanOrEqual(ingredients.count, 20)
        XCTAssertTrue(ingredients.allSatisfy { $0.confidence >= 0 && $0.confidence <= 1 })
        // Sorted by descending confidence for a nicer "most likely first" UI.
        XCTAssertEqual(ingredients, ingredients.sorted { $0.confidence > $1.confidence })
    }

    func testRecipeServiceRejectsEmptyIngredientList() async {
        let service = MockRecipeGenerationService(bundle: bundle)
        do {
            _ = try await service.generateRecipes(from: [], filters: [])
            XCTFail("Expected noIngredientsProvided error")
        } catch is RecipeGenerationError {
            // expected
        } catch {
            XCTFail("Unexpected error type: \(error)")
        }
    }

    func testRecipeServiceRespectsCategoryTargetCounts() async throws {
        let service = MockRecipeGenerationService(bundle: bundle)
        let ingredients = [
            DetectedIngredient(name: "Œufs", category: .egg, confidence: 0.9),
            DetectedIngredient(name: "Cheddar", category: .dairy, confidence: 0.9),
            DetectedIngredient(name: "Beurre", category: .butter, confidence: 0.9),
            DetectedIngredient(name: "Poulet", category: .meat, confidence: 0.9),
            DetectedIngredient(name: "Tomates", category: .vegetable, confidence: 0.9),
        ]

        let byCategory = try await service.generateRecipes(from: ingredients, filters: [])

        for category in MealCategory.allCases {
            let recipes = byCategory[category] ?? []
            XCTAssertLessThanOrEqual(recipes.count, category.targetRecipeCount)
        }
    }

    func testRecipeServicePrioritizesFewestMissingIngredients() async throws {
        let service = MockRecipeGenerationService(bundle: bundle)
        let ingredients = [
            DetectedIngredient(name: "Poulet", category: .meat, confidence: 0.9),
            DetectedIngredient(name: "Salade", category: .vegetable, confidence: 0.9),
            DetectedIngredient(name: "Parmesan", category: .dairy, confidence: 0.9),
            DetectedIngredient(name: "Citron", category: .fruit, confidence: 0.9),
            DetectedIngredient(name: "Ail", category: .vegetable, confidence: 0.9),
        ]

        let byCategory = try await service.generateRecipes(from: ingredients, filters: [])
        let lunchRecipes = byCategory[.lunch] ?? []

        let missingCounts = lunchRecipes.map(\.missingIngredients.count)
        XCTAssertEqual(missingCounts, missingCounts.sorted())
    }
}
