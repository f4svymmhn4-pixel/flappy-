import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radius } from "../theme/theme";

interface Props {
  progress: number; // 0..1
}

export function ProgressBar({ progress }: Props) {
  const value = useSharedValue(progress);

  useEffect(() => {
    value.value = withTiming(progress, { duration: 350 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${value.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fillWrap, animatedStyle]}>
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fillWrap: {
    height: "100%",
  },
  fill: {
    flex: 1,
    borderRadius: radius.pill,
  },
});
