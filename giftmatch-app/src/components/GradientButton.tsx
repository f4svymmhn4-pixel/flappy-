import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors, gradients, radius, shadow, typography } from "../theme/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  label: string;
  onPress: () => void;
  colorsOverride?: [string, string];
  style?: ViewStyle;
  disabled?: boolean;
  size?: "large" | "medium";
}

export function GradientButton({
  label,
  onPress,
  colorsOverride,
  style,
  disabled,
  size = "large",
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      style={[animatedStyle, style, disabled && { opacity: 0.5 }]}
    >
      <LinearGradient
        colors={colorsOverride ?? gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.base,
          size === "medium" && styles.medium,
          shadow.glow,
        ]}
      >
        <Text style={[typography.bodyBold, styles.label]}>{label}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 22,
    paddingHorizontal: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: undefined,
  },
  label: {
    color: colors.white,
    fontSize: 18,
    letterSpacing: 0.4,
  },
});
