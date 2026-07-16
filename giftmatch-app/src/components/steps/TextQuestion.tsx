import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "../../theme/theme";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  examples?: string[];
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}

export function TextQuestion({ value, onChange, placeholder, examples, multiline, keyboardType }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textDim}
          style={[styles.input, multiline && styles.inputMultiline]}
          multiline={multiline}
          keyboardType={keyboardType ?? "default"}
        />
        {examples ? (
          <View style={styles.examples}>
            <Text style={styles.examplesLabel}>Exemples :</Text>
            {examples.map((ex) => (
              <Text key={ex} style={styles.exampleItem}>
                "{ex}"
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 24 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  examples: {
    marginTop: spacing.lg,
  },
  examplesLabel: {
    ...typography.small,
    color: colors.textDim,
    marginBottom: spacing.sm,
  },
  exampleItem: {
    color: colors.textMuted,
    fontStyle: "italic",
    marginBottom: 6,
  },
});
