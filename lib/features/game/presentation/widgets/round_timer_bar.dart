import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../app/theme/app_spacing.dart';
import '../../../../app/theme/app_text_styles.dart';

class RoundTimerBar extends StatelessWidget {
  const RoundTimerBar({required this.remaining, required this.total, super.key});

  final Duration remaining;
  final Duration total;

  @override
  Widget build(BuildContext context) {
    final double fraction = total.inMilliseconds == 0
        ? 0
        : (remaining.inMilliseconds / total.inMilliseconds).clamp(0, 1);
    final int secondsLeft = (remaining.inMilliseconds / 1000).ceil();
    final Color color = fraction < 0.25 ? AppColors.error : AppColors.primary;

    return Row(
      children: [
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.pill),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              height: 10,
              alignment: Alignment.centerLeft,
              color: color.withValues(alpha: 0.15),
              child: FractionallySizedBox(
                widthFactor: fraction,
                child: Container(color: color),
              ),
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        SizedBox(
          width: 24,
          child: Text('$secondsLeft', style: AppTextStyles.bodyStrong, textAlign: TextAlign.right),
        ),
      ],
    );
  }
}
