import 'package:flutter/cupertino.dart' show CupertinoPageTransitionsBuilder;
import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_spacing.dart' show AppRadius;
import 'app_text_styles.dart';

/// Central [ThemeData] factory. Every screen must resolve styling through
/// `Theme.of(context)` (or the constants in this folder) instead of
/// hardcoding colors/fonts inline, so a future rebrand only touches this
/// file.
abstract final class AppTheme {
  static ThemeData get light => _build(brightness: Brightness.light);

  static ThemeData get dark => _build(brightness: Brightness.dark);

  static ThemeData _build({required Brightness brightness}) {
    final bool isDark = brightness == Brightness.dark;
    final ColorScheme colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      brightness: brightness,
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      tertiary: AppColors.tertiary,
      error: AppColors.error,
      surface: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
    );

    final Color textPrimary = isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final Color textSecondary =
        isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      fontFamily: AppTextStyles.fontFamily,
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayLarge.copyWith(color: textPrimary),
        headlineMedium: AppTextStyles.headline.copyWith(color: textPrimary),
        titleMedium: AppTextStyles.title.copyWith(color: textPrimary),
        bodyLarge: AppTextStyles.body.copyWith(color: textPrimary),
        bodyMedium: AppTextStyles.body.copyWith(color: textSecondary),
        labelLarge: AppTextStyles.bodyStrong.copyWith(color: textPrimary),
        bodySmall: AppTextStyles.caption.copyWith(color: textSecondary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        foregroundColor: textPrimary,
        titleTextStyle: AppTextStyles.title.copyWith(color: textPrimary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          textStyle: AppTextStyles.bodyStrong,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
          elevation: 0,
        ),
      ),
      cardTheme: CardThemeData(
        color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
        margin: EdgeInsets.zero,
      ),
      splashFactory: InkSparkle.splashFactory,
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}
