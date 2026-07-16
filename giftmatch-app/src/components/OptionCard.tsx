import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, typography } from "../theme/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  emoji: string;
  label: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  index?: number;
  compact?: boolean;
}

export function OptionCard({ emoji, label, subtitle, selected, onPress, index = 0, compact }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 40).duration(320)}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={animatedStyle}
    >
      <View
        style={[
          styles.card,
          compact && styles.compact,
          selected && styles.selected,
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textWrap}>
          <Text style={[typography.bodyBold, styles.label, selected && styles.labelSelected]}>
            {label}
          </Text>
          {subtitle ? (
            <Text style={[typography.small, styles.subtitle]}>{subtitle}</Text>
          ) : null}
        </View>
        {selected ? <Text style={styles.check}>✓</Text> : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: spacing.sm,
  },
  compact: {
    paddingVertical: 14,
  },
  selected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.surfaceLight,
  },
  emoji: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: colors.text,
  },
  labelSelected: {
    color: colors.primaryLight,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 2,
  },
  check: {
    color: colors.primaryLight,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
});
