import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, shadow, spacing, typography } from "../theme/theme";

interface Props {
  visible: boolean;
  title: string;
  initialValue?: string;
  placeholder?: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}

/**
 * Small centered prompt used both right after saving a gift (optional name)
 * and later from the favorites list (rename). React Native has no
 * cross-platform equivalent of iOS's Alert.prompt, hence a real Modal.
 */
export function RenameModal({ visible, title, initialValue, placeholder, onCancel, onSave }: Props) {
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (visible) setValue(initialValue ?? "");
  }, [visible, initialValue]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={[styles.card, shadow.soft]}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder ?? 'Ex : "Cadeau maman"'}
            placeholderTextColor={colors.textDim}
            style={styles.input}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => onSave(value)}
          />
          <View style={styles.actions}>
            <Pressable style={styles.secondaryBtn} onPress={onCancel}>
              <Text style={styles.secondaryText}>Passer</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={() => onSave(value)}>
              <Text style={styles.primaryText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "700",
  },
});
