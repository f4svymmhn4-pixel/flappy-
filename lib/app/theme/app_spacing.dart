/// 4pt spacing scale, used instead of magic numbers throughout the UI so
/// paddings/gaps stay visually consistent across screens.
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
}

/// Corner radii for the "premium, rounded" look requested for buttons,
/// cards and the answer tiles.
abstract final class AppRadius {
  static const double sm = 12;
  static const double md = 20;
  static const double lg = 28;
  static const double pill = 999;
}
