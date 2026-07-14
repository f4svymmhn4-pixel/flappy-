import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../../../core/error/failure.dart';
import '../../domain/pseudo_rules.dart';
import '../controllers/pseudo_controller.dart';

class PseudoScreen extends ConsumerStatefulWidget {
  const PseudoScreen({super.key});

  @override
  ConsumerState<PseudoScreen> createState() => _PseudoScreenState();
}

class _PseudoScreenState extends ConsumerState<PseudoScreen> {
  final TextEditingController _textController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final bool success = await ref
        .read(pseudoControllerProvider.notifier)
        .submit(_textController.text.trim());

    if (success && mounted) {
      context.go(RoutePaths.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    final AsyncValue<void> state = ref.watch(pseudoControllerProvider);
    final bool isSubmitting = state.isLoading;

    ref.listen(pseudoControllerProvider, (previous, next) {
      final Object? error = next.error;
      if (error is Failure && next.hasError) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(error.message)));
      }
    });

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Choisis ton pseudo',
                  style: AppTextStyles.displayLarge,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  'Il sera visible de tous les joueurs. Tu pourras le changer plus tard.',
                  style: AppTextStyles.body,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.xl),
                TextFormField(
                  controller: _textController,
                  autofocus: true,
                  maxLength: pseudoMaxLength,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.headline,
                  decoration: const InputDecoration(
                    hintText: 'Pseudo',
                    counterText: '',
                  ),
                  validator: (value) => validatePseudo(value ?? ''),
                  onFieldSubmitted: (_) => _submit(),
                  enabled: !isSubmitting,
                ),
                const SizedBox(height: AppSpacing.lg),
                ElevatedButton(
                  onPressed: isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  child: isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(Colors.white),
                          ),
                        )
                      : const Text('Continuer'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
