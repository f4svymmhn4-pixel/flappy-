import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Option } from "../../data/questions";
import { Chip } from "../Chip";

interface Props<T extends string> {
  options: Option<T>[];
  values: T[];
  onToggle: (value: T) => void;
}

export function MultiSelectQuestion<T extends string>({ options, values, onToggle }: Props<T>) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.wrap}>
        {options.map((option, index) => (
          <Chip
            key={option.value}
            emoji={option.emoji}
            label={option.label}
            selected={values.includes(option.value)}
            onPress={() => onToggle(option.value)}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  wrap: { flexDirection: "row", flexWrap: "wrap" },
});
