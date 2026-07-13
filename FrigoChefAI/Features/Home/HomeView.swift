import SwiftUI

/// Landing screen: minimalist hero + the two big capture actions, per the
/// product brief ("l'utilisateur ne doit rien saisir manuellement").
struct HomeView: View {
    @Binding var path: NavigationPath

    @State private var viewModel = HomeViewModel()
    @State private var isShowingCamera = false

    var body: some View {
        ZStack {
            AppGradients.heroBackground
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: AppSpacing.xl) {
                    header

                    illustration

                    VStack(spacing: AppSpacing.md) {
                        PrimaryActionButton(title: "Prendre une photo", symbolName: "camera.fill") {
                            if viewModel.handleTakePhotoTapped() {
                                isShowingCamera = true
                            }
                        }

                        PhotoPickerButton(onPick: { data in
                            path.append(AppRoute.analysis(imageData: data))
                        }) {
                            PrimaryActionButtonLabel(
                                title: "Choisir une photo",
                                symbolName: "photo.on.rectangle",
                                gradient: AppGradients.secondaryButton
                            )
                        }
                    }
                    .padding(.horizontal, AppSpacing.lg)

                    tips
                }
                .padding(.top, AppSpacing.xl)
                .padding(.bottom, AppSpacing.xxl)
            }
        }
        .fullScreenCover(isPresented: $isShowingCamera) {
            CameraCaptureView(
                onCapture: { data in
                    isShowingCamera = false
                    path.append(AppRoute.analysis(imageData: data))
                },
                onCancel: { isShowingCamera = false }
            )
            .ignoresSafeArea()
        }
        .alert("Caméra indisponible", isPresented: $viewModel.isCameraUnavailableAlertPresented) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Cet appareil ne dispose pas de caméra. Choisissez une photo depuis votre galerie.")
        }
    }

    private var header: some View {
        VStack(spacing: AppSpacing.xs) {
            Text("FrigoChef AI")
                .font(AppFont.largeTitle())
                .foregroundStyle(AppColors.textPrimary)
            Text("Photographiez votre frigo, on s'occupe du reste.")
                .font(AppFont.subheadline())
                .foregroundStyle(AppColors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(.horizontal, AppSpacing.lg)
    }

    private var illustration: some View {
        Image(systemName: "refrigerator.fill")
            .font(.system(size: 84, weight: .medium))
            .foregroundStyle(AppGradients.primaryButton)
            .padding(AppSpacing.xl)
            .background(.white.opacity(0.5), in: Circle())
            .appShadow(AppShadow.card)
    }

    private var tips: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            tipRow(symbol: "sparkles", text: "Notre IA identifie légumes, viandes, sauces, boissons et plus encore.")
            tipRow(symbol: "fork.knife", text: "Recevez des idées de repas réalistes, sans rien saisir.")
            tipRow(symbol: "heart.fill", text: "Enregistrez vos recettes préférées pour les retrouver hors connexion.")
        }
        .padding(AppSpacing.md)
        .background(AppColors.card.opacity(0.7))
        .clipShape(RoundedRectangle(cornerRadius: AppRadius.medium, style: .continuous))
        .padding(.horizontal, AppSpacing.lg)
    }

    private func tipRow(symbol: String, text: String) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.sm) {
            Image(systemName: symbol)
                .foregroundStyle(AppColors.primary)
                .frame(width: 20)
            Text(text)
                .font(AppFont.callout())
                .foregroundStyle(AppColors.textPrimary)
        }
    }
}
