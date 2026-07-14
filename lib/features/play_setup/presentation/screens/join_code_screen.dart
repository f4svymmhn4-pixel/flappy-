import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../controllers/play_setup_controller.dart';

class JoinCodeScreen extends ConsumerStatefulWidget {
  const JoinCodeScreen({super.key});

  @override
  ConsumerState<JoinCodeScreen> createState() => _JoinCodeScreenState();
}

class _JoinCodeScreenState extends ConsumerState<JoinCodeScreen> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final String code = _controller.text.trim();
    if (code.length != 6) return;
    ref.read(playSetupControllerProvider.notifier).setRoomCode(code);
    context.push(RoutePaths.animalSelect);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rejoindre une partie')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              "Entre le code à 6 caractères que t'a donné l'hôte.",
              style: AppTextStyles.body,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.lg),
            TextField(
              controller: _controller,
              autofocus: true,
              maxLength: 6,
              textAlign: TextAlign.center,
              textCapitalization: TextCapitalization.characters,
              style: AppTextStyles.displayLarge.copyWith(letterSpacing: 4),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp('[a-zA-Z0-9]')),
                UpperCaseTextFormatter(),
              ],
              decoration: const InputDecoration(counterText: ''),
              onSubmitted: (_) => _submit(),
            ),
            const SizedBox(height: AppSpacing.lg),
            ValueListenableBuilder<TextEditingValue>(
              valueListenable: _controller,
              builder: (context, value, _) {
                return ElevatedButton(
                  onPressed: value.text.trim().length == 6 ? _submit : null,
                  child: const Text('Continuer'),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    return newValue.copyWith(text: newValue.text.toUpperCase());
  }
}
