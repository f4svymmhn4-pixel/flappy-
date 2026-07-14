import 'package:flutter/material.dart';

import '../../../../app/theme/app_colors.dart';

/// A small marker representing one player's animal, shown wherever that
/// player currently "is" — center (undecided) or on the answer tile they
/// picked. Kept deliberately plain (a pets icon in a colored circle, not
/// the animal's real art) until the Animations step adds the actual
/// sprite + movement.
class PlayerBadge extends StatelessWidget {
  const PlayerBadge({required this.isBot, super.key});

  final bool isBot;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: (isBot ? AppColors.tertiary : AppColors.primary).withValues(alpha: 0.85),
      ),
      child: Icon(
        isBot ? Icons.smart_toy_rounded : Icons.pets_rounded,
        size: 13,
        color: Colors.white,
      ),
    );
  }
}
