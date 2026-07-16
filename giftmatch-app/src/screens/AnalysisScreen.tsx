import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { colors, gradients, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Analysis">;

const MESSAGES = [
  "Analyse du profil...",
  "Recherche des cadeaux parfaits...",
  "Création de ta sélection...",
];

const STEP_DURATION = 950;

export function AnalysisScreen({ navigation }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1400 }), -1, false);
  }, []);

  useEffect(() => {
    if (messageIndex >= MESSAGES.length - 1) {
      const finalTimer = setTimeout(() => {
        navigation.replace("Results");
      }, STEP_DURATION);
      return () => clearTimeout(finalTimer);
    }
    const timer = setTimeout(() => setMessageIndex((i) => i + 1), STEP_DURATION);
    return () => clearTimeout(timer);
  }, [messageIndex]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundAlt]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Animated.View style={[styles.ring, spinStyle]}>
            <LinearGradient colors={gradients.hero} style={styles.ringGradient} />
          </Animated.View>
          <Text style={styles.emoji}>🎁</Text>
          <Animated.Text
            key={messageIndex}
            entering={FadeIn.duration(350)}
            exiting={FadeOut.duration(200)}
            style={[typography.h3, styles.message]}
          >
            {MESSAGES[messageIndex]}
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -80,
  },
  ringGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.35,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  message: {
    color: colors.text,
    textAlign: "center",
  },
});
