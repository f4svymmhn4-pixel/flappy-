import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { GradientButton } from "../components/GradientButton";
import { colors, gradients, spacing, typography } from "../theme/theme";
import { useQuiz } from "../context/QuizContext";
import { useFavorites } from "../context/FavoritesContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { reset } = useQuiz();
  const { favoriteIds } = useFavorites();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundAlt]} style={StyleSheet.absoluteFill} />
      <Animated.View
        entering={FadeIn.duration(900)}
        style={[styles.glow, { backgroundColor: colors.primary }]}
      />
      <SafeAreaView style={styles.safe}>
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.logoWrap}>
          <LinearGradient colors={gradients.hero} style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🎁</Text>
          </LinearGradient>
          <Text style={styles.brand}>GiftMatch</Text>
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
          {favoriteIds.length > 0 ? (
            <Text style={styles.favLink} onPress={() => navigation.navigate("Favorites")}>
              ❤️ Voir mes {favoriteIds.length} cadeau{favoriteIds.length > 1 ? "x" : ""} sauvegardé{favoriteIds.length > 1 ? "s" : ""}
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
    width: 320,
    height: 320,
    borderRadius: 320,
    top: -120,
    right: -100,
    opacity: 0.25,
  },
  logoWrap: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  logoEmoji: { fontSize: 36 },
  brand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
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
