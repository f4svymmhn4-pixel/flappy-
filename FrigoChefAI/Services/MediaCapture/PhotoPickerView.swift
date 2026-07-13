import PhotosUI
import SwiftUI

/// Reusable `PhotosPicker` wrapper: renders any label content and hands back
/// raw image `Data` once the user picks a photo from their library.
struct PhotoPickerButton<Label: View>: View {
    var onPick: (Data) -> Void
    @ViewBuilder var label: () -> Label

    @State private var selection: PhotosPickerItem?

    var body: some View {
        PhotosPicker(selection: $selection, matching: .images) {
            label()
        }
        .onChange(of: selection) { _, newValue in
            guard let newValue else { return }
            Task {
                if let data = try? await newValue.loadTransferable(type: Data.self) {
                    onPick(data)
                    selection = nil
                }
            }
        }
    }
}
