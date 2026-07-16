export const colors = {
  background: "#0F0B1E",
  backgroundAlt: "#1A1330",
  surface: "#231B3B",
  surfaceLight: "#2E2450",
  primary: "#7C3AED",
  primaryLight: "#A78BFA",
  accent: "#F472B6",
  gold: "#FBBF24",
  text: "#FFFFFF",
  textMuted: "#B9B0D6",
  textDim: "#8478A8",
  success: "#34D399",
  border: "rgba(255,255,255,0.10)",
  white: "#FFFFFF",
};

export const gradients: Record<string, [string, string]> = {
  hero: ["#7C3AED", "#EC4899"],
  button: ["#7C3AED", "#DB2777"],
  card: ["#231B3B", "#2E2450"],
  gold: ["#FBBF24", "#F59E0B"],
  silver: ["#CBD5E1", "#94A3B8"],
  bronze: ["#D97706", "#92400E"],
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

export const typography = {
  h1: { fontSize: 32, fontWeight: "800" as const },
  h2: { fontSize: 24, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "700" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodyBold: { fontSize: 16, fontWeight: "600" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 26,
    elevation: 10,
  },
};
