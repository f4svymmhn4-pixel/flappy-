import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Option } from "../../data/questions";
import { OptionCard } from "../OptionCard";

interface Props<T extends string> {
  options: Option<T>[];
  value?: T;
  onSelect: (value: T) => void;
  withSubtitles?: boolean;
}

export function SingleSelectQuestion<T extends string>({
  options,
  value,
  onSelect,
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
          selected={value === option.value}
          onPress={() => onSelect(option.value)}
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
