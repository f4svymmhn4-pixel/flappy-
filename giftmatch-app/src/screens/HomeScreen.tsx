import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { GradientButton } from "../components/GradientButton";
import { colors, fonts, spacing, typography } from "../theme/theme";
import { useQuiz } from "../context/QuizContext";
import { useFavorites } from "../context/FavoritesContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { reset } = useQuiz();
  const { favorites } = useFavorites();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundAlt]} style={StyleSheet.absoluteFill} />
      <Animated.View
        entering={FadeIn.duration(900)}
        style={[styles.glow, styles.glowTop, { backgroundColor: colors.accent }]}
      />
      <Animated.View
        entering={FadeIn.duration(900)}
        style={[styles.glow, styles.glowBottom, { backgroundColor: colors.accent }]}
      />
      <SafeAreaView style={styles.safe}>
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.logoWrap}>
          <Image
            source={require("../../assets/logo-mark.png")}
            style={styles.logoBadge}
            resizeMode="contain"
          />
          <Text style={styles.brand}>La Perle Rare</Text>
        </Animated.View>

        <View style={styles.center}>
          <Animated.Text entering={FadeInDown.delay(250).duration(600)} style={[typography.h1, styles.tagline]}>
            Trouve un cadeau qu'il/elle va{"\n"}vraiment adorer
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(400).duration(600)} style={styles.subtitle}>
            Réponds à quelques questions. Notre algorithme analyse le profil et te propose les 3 cadeaux les plus pertinents — avec la raison précise de chaque choix.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.delay(550).duration(600)} style={styles.ctaWrap}>
          <GradientButton
            label="🎁  TROUVE TON CADEAU"
            onPress={() => {
              reset();
              navigation.navigate("Questionnaire");
            }}
          />
          {favorites.length > 0 ? (
            <Text style={styles.favLink} onPress={() => navigation.navigate("Favorites")}>
              ❤️ Voir mes {favorites.length} cadeau{favorites.length > 1 ? "x" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}
            </Text>
          ) : null}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: "space-between" },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 280,
  },
  glowTop: {
    top: -110,
    right: -90,
    opacity: 0.35,
  },
  glowBottom: {
    bottom: -100,
    left: -100,
    opacity: 0.3,
  },
  logoWrap: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  logoBadge: {
    width: 128,
    height: 128,
    marginBottom: spacing.xs,
  },
  brand: {
    color: colors.primaryLight,
    fontSize: 26,
    fontFamily: fonts.serifBold,
    letterSpacing: 0.4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  tagline: {
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  ctaWrap: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  favLink: {
    color: colors.primaryLight,
    marginTop: spacing.md,
    fontWeight: "600",
  },
});
