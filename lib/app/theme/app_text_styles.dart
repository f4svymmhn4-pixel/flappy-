import 'package:flutter/material.dart';

/// Typography scale. Uses the platform system font (San Francisco / Roboto)
/// for an Apple-like, native feel instead of a bundled webfont — this also
/// avoids shipping extra font assets and keeps text rendering crisp at any
/// device scale factor.
abstract final class AppTextStyles {
  static const String fontFamily = '.SF Pro Text';

  static const TextStyle displayLarge = TextStyle(
    fontSize: 34,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.5,
    height: 1.1,
  );

  static const TextStyle headline = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.3,
    height: 1.2,
  );

  static const TextStyle title = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.25,
  );

  static const TextStyle body = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  static const TextStyle bodyStrong = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.1,
    height: 1.3,
  );

  /// Big, bold answer-button label — legible at arm's length under time
  /// pressure.
  static const TextStyle answerLabel = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    height: 1.2,
  );
}
