import Observation
import UIKit

/// Thin presentation logic for the Home screen: mostly device capability
/// checks so the view stays declarative.
@MainActor
@Observable
final class HomeViewModel {
    var isCameraUnavailableAlertPresented = false

    var isCameraAvailable: Bool {
        UIImagePickerController.isSourceTypeAvailable(.camera)
    }

    func handleTakePhotoTapped() -> Bool {
        guard isCameraAvailable else {
            isCameraUnavailableAlertPresented = true
            return false
        }
        return true
    }
}
