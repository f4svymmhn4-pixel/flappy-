import 'package:flutter/material.dart';

import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_text_styles.dart';

/// Temporary scaffold shown for features not yet implemented.
///
/// Every route in [AppRouter] resolves to a real screen from day one so
/// navigation, deep links and the shell can be exercised end-to-end while
/// each feature is built out in its own step. Delete the call site once the
/// real screen lands — this widget itself stays for any future stub needs.
class PlaceholderScreen extends StatelessWidget {
  const PlaceholderScreen({required this.title, super.key, this.subtitle});

  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.construction_rounded, size: 48),
              const SizedBox(height: AppSpacing.md),
              Text(title, style: AppTextStyles.headline, textAlign: TextAlign.center),
              if (subtitle != null) ...[
                const SizedBox(height: AppSpacing.sm),
                Text(subtitle!, style: AppTextStyles.body, textAlign: TextAlign.center),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
