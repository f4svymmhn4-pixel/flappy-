export const colors = {
  background: "#03100F",
  backgroundAlt: "#0A2624",
  surface: "#0A2422",
  surfaceLight: "#123330",
  primary: "#D9AD63",
  primaryLight: "#E8C687",
  accent: "#1F6B57",
  gold: "#D9AD63",
  text: "#F5EFDD",
  textMuted: "#C7D0C2",
  textDim: "#7C9089",
  success: "#4ADE80",
  border: "rgba(217,173,99,0.35)",
  white: "#FFFFFF",
  /** Dark text used on top of gold-filled surfaces (buttons, pills), where
   * white would fail contrast against the light gold fill. */
  textOnGold: "#12241F",
};

export const gradients: Record<string, [string, string]> = {
  hero: ["#F0D9A0", "#D9A96A"],
  button: ["#F0D9A0", "#D9A96A"],
  card: ["#0A2422", "#123330"],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

/** Elegant serif for headings/brand, matching the "La Perle Rare" direction
 * artistique; body copy stays on the platform's default sans-serif for
 * readability at small sizes. */
export const fonts = {
  serif: "PlayfairDisplay_600SemiBold",
  serifBold: "PlayfairDisplay_700Bold",
};

export const typography = {
  h1: { fontSize: 32, fontWeight: "700" as const, fontFamily: fonts.serifBold },
  h2: { fontSize: 24, fontWeight: "700" as const, fontFamily: fonts.serifBold },
  h3: { fontSize: 19, fontWeight: "600" as const, fontFamily: fonts.serif },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodyBold: { fontSize: 16, fontWeight: "600" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowColor: "#D9AD63",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 26,
    elevation: 10,
  },
};
