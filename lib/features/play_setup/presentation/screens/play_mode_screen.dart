import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router/route_paths.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';
import '../../domain/play_mode.dart';
import '../controllers/play_setup_controller.dart';

class PlayModeScreen extends ConsumerWidget {
  const PlayModeScreen({super.key});

  void _choose(BuildContext context, WidgetRef ref, PlayMode mode) {
    ref.read(playSetupControllerProvider.notifier).selectMode(mode);
    context.push(mode == PlayMode.joinPrivate ? RoutePaths.joinByCode : RoutePaths.difficultySelect);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Jouer')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _ModeCard(
              icon: Icons.bolt_rounded,
              title: 'Partie rapide',
              subtitle: 'Rejoins 4 autres joueurs au hasard.',
              onTap: () => _choose(context, ref, PlayMode.quickMatch),
            ),
            const SizedBox(height: AppSpacing.md),
            _ModeCard(
              icon: Icons.group_add_rounded,
              title: 'Créer une partie privée',
              subtitle: 'Génère un code à partager avec tes amis.',
              onTap: () => _choose(context, ref, PlayMode.createPrivate),
            ),
            const SizedBox(height: AppSpacing.md),
            _ModeCard(
              icon: Icons.password_rounded,
              title: 'Rejoindre avec un code',
              subtitle: "Entre le code d'une partie déjà créée.",
              onTap: () => _choose(context, ref, PlayMode.joinPrivate),
            ),
            const SizedBox(height: AppSpacing.md),
            _ModeCard(
              icon: Icons.smart_toy_rounded,
              title: 'Solo',
              subtitle: 'Affronte 4 animaux pilotés par ordinateur.',
              onTap: () => _choose(context, ref, PlayMode.solo),
            ),
          ],
        ),
      ),
    );
  }
}

class _ModeCard extends StatelessWidget {
  const _ModeCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              Icon(icon, size: 28),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTextStyles.bodyStrong),
                    const SizedBox(height: AppSpacing.xs),
                    Text(subtitle, style: AppTextStyles.caption),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded),
            ],
          ),
        ),
      ),
    );
  }
}
