import SwiftUI

/// Sheet letting the user narrow recipe results by diet/goal/time/budget.
struct FiltersView: View {
    @Binding var selectedFilters: Set<DietaryFilter>
    @Environment(\.dismiss) private var dismiss
    @State private var draft: Set<DietaryFilter> = []

    var body: some View {
        NavigationStack {
            ScrollView {
                FlowLayout(spacing: AppSpacing.sm) {
                    ForEach(DietaryFilter.allCases) { filter in
                        FilterChip(filter: filter, isSelected: draft.contains(filter)) {
                            toggle(filter)
                        }
                    }
                }
                .padding(AppSpacing.lg)
            }
            .background(AppColors.background.ignoresSafeArea())
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Fermer") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Appliquer") {
                        selectedFilters = draft
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
                ToolbarItem(placement: .bottomBar) {
                    Button("Réinitialiser") { draft.removeAll() }
                        .disabled(draft.isEmpty)
                }
            }
        }
        .onAppear { draft = selectedFilters }
    }

    private func toggle(_ filter: DietaryFilter) {
        if draft.contains(filter) {
            draft.remove(filter)
        } else {
            draft.insert(filter)
        }
    }
}
