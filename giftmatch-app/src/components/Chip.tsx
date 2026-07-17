import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "../theme/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export function Chip({ emoji, label, selected, onPress, index = 0 }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      entering={FadeIn.delay(Math.min(index * 15, 300)).duration(250)}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[styles.chip, selected && styles.chipSelected, animatedStyle]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[typography.small, styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.surfaceLight,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.text,
    fontWeight: "700",
  },
});
