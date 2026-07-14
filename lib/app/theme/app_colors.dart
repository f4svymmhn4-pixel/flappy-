import 'package:flutter/material.dart';

/// Nature-inspired, high-contrast palette. Kept as raw [Color] constants
/// (rather than baked into a single [ColorScheme]) so individual features
/// —like per-category backgrounds— can reference specific hues directly.
abstract final class AppColors {
  // Brand
  static const Color primary = Color(0xFF2FB380); // fresh leaf green
  static const Color primaryDark = Color(0xFF1F8C63);
  static const Color secondary = Color(0xFFFFB238); // warm amber accent
  static const Color tertiary = Color(0xFF3E8BFF); // sky blue accent

  // Feedback
  static const Color success = Color(0xFF34C759);
  static const Color error = Color(0xFFFF3B30);
  static const Color warning = Color(0xFFFFCC00);

  // Neutrals (light)
  static const Color backgroundLight = Color(0xFFF7F8F5);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color textPrimaryLight = Color(0xFF1C1C1E);
  static const Color textSecondaryLight = Color(0xFF6B6F76);

  // Neutrals (dark)
  static const Color backgroundDark = Color(0xFF111311);
  static const Color surfaceDark = Color(0xFF1C1E1C);
  static const Color textPrimaryDark = Color(0xFFF5F6F3);
  static const Color textSecondaryDark = Color(0xFFA5A9A3);

  // Answer quad (2x2 grid) — distinct, colorblind-considerate hues
  static const Color answerRed = Color(0xFFFF5A5F);
  static const Color answerBlue = Color(0xFF3E8BFF);
  static const Color answerYellow = Color(0xFFFFC24B);
  static const Color answerGreen = Color(0xFF34C77B);

  // Rarity tiers used in the shop / animal cards
  static const Color rarityCommon = Color(0xFF9AA0A6);
  static const Color rarityRare = Color(0xFF3E8BFF);
  static const Color rarityEpic = Color(0xFFA259FF);
  static const Color rarityLegendary = Color(0xFFFFB238);
}
