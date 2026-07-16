import React from "react";
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Gift } from "../types/domain";
import { colors, radius, shadow, spacing, typography } from "../theme/theme";

interface Props {
  gift: Gift | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * A real cross-platform Modal listing every shopping link for a gift.
 * Replaces a native Alert, which react-native-web cannot render with more
 * than a plain OK/Cancel — dynamic per-store buttons silently did nothing.
 */
export function GiftLinksModal({ gift, visible, onClose }: Props) {
  return (
    <Modal
      visible={visible && !!gift}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, shadow.soft]}>
          {gift ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <LinearGradient colors={gift.couleurs} style={styles.header}>
                <Text style={styles.headerEmoji}>{gift.emoji}</Text>
                <Text style={styles.headerName}>{gift.nom}</Text>
                <Text style={styles.headerPrice}>
                  {gift.prixMin === gift.prixMax
                    ? `${gift.prixMin} €`
                    : `${gift.prixMin} – ${gift.prixMax} €`}
                </Text>
              </LinearGradient>

              <View style={styles.body}>
                <Text style={styles.description}>{gift.description}</Text>

                <Text style={styles.sectionLabel}>Où le trouver</Text>
                <View style={styles.linksList}>
                  {gift.liens.map((lien) => (
                    <Pressable
                      key={lien.boutique}
                      style={styles.linkRow}
                      onPress={() => Linking.openURL(lien.url).catch(() => {})}
                    >
                      <View style={styles.linkTextWrap}>
                        <Text style={styles.linkStore}>{lien.boutique}</Text>
                        <Text style={styles.linkUrl} numberOfLines={1}>
                          {lien.url}
                        </Text>
                      </View>
                      <Text style={styles.linkArrow}>↗</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable style={styles.closeBtn} onPress={onClose}>
                  <Text style={styles.closeBtnText}>Fermer</Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    maxHeight: "85%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerName: {
    ...typography.h3,
    color: colors.white,
    textAlign: "center",
  },
  headerPrice: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  body: {
    padding: spacing.lg,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.primaryLight,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linksList: {
    marginBottom: spacing.lg,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  linkTextWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  linkStore: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  linkUrl: {
    color: colors.textDim,
    fontSize: 12,
  },
  linkArrow: {
    color: colors.primaryLight,
    fontSize: 20,
    fontWeight: "700",
  },
  closeBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontWeight: "600",
  },
});
