import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Option } from "../../data/questions";
import { OptionCard } from "../OptionCard";

interface Props<T extends string> {
  options: Option<T>[];
  values: T[];
  onToggle: (value: T) => void;
  withSubtitles?: boolean;
}

/** Same card layout as SingleSelectQuestion, but toggles multiple selections. */
export function CardMultiSelectQuestion<T extends string>({
  options,
  values,
  onToggle,
  withSubtitles,
}: Props<T>) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {options.map((option, index) => (
        <OptionCard
          key={option.value}
          emoji={option.emoji}
          label={option.label}
          subtitle={withSubtitles ? option.subtitle : undefined}
          selected={values.includes(option.value)}
          onPress={() => onToggle(option.value)}
          index={index}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
});
