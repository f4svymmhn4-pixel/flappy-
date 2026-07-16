import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ScoredGift } from "../types/domain";
import { colors, radius, shadow, spacing, typography } from "../theme/theme";

const RANK_META = {
  1: { medal: "🥇", title: "Cadeau parfait", colors: ["#FBBF24", "#F59E0B"] as [string, string] },
  2: { medal: "🥈", title: "Alternative originale", colors: ["#CBD5E1", "#94A3B8"] as [string, string] },
  3: { medal: "🥉", title: "Option plus économique", colors: ["#D97706", "#92400E"] as [string, string] },
};

interface Props {
  scored: ScoredGift;
  rank: 1 | 2 | 3;
  reason: string;
  saved: boolean;
  onOpenLinks: () => void;
  onSave: () => void;
  onShare: () => void;
  index?: number;
}

export function GiftCard({ scored, rank, reason, saved, onOpenLinks, onSave, onShare, index = 0 }: Props) {
  const meta = RANK_META[rank];
  const { gift, compatibility } = scored;

  return (
    <Animated.View entering={FadeInUp.delay(index * 120).duration(450)} style={[styles.card, shadow.soft]}>
      <LinearGradient colors={gift.couleurs} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.rankPill}>
            <Text style={styles.rankText}>
              {meta.medal} {meta.title}
            </Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{compatibility}% compatible</Text>
          </View>
        </View>
        <Text style={styles.emoji}>{gift.emoji}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={[typography.h3, styles.name]}>{gift.nom}</Text>
        <Text style={styles.price}>
          {gift.prixMin === gift.prixMax
            ? `${gift.prixMin} €`
            : `${gift.prixMin} – ${gift.prixMax} €`}
        </Text>
        <Text style={[typography.body, styles.description]}>{gift.description}</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Pourquoi il/elle va aimer :</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.actionBtn, styles.primaryAction]} onPress={onOpenLinks}>
            <Text style={styles.primaryActionText}>🛒 Voir le cadeau</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={onSave}>
            <Text style={styles.actionText}>{saved ? "❤️ Sauvegardé" : "🤍 Sauvegarder"}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={onShare}>
            <Text style={styles.actionText}>↗️ Partager</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankPill: {
    backgroundColor: "rgba(0,0,0,0.28)",
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  rankText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  scorePill: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  scoreText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
  },
  emoji: {
    fontSize: 64,
    textAlign: "center",
    marginTop: spacing.md,
  },
  body: {
    padding: spacing.lg,
  },
  name: {
    color: colors.text,
    marginBottom: 4,
  },
  price: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  reasonBox: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reasonLabel: {
    color: colors.primaryLight,
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 13,
  },
  reasonText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBtn: {
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceLight,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  primaryActionText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  actionText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
});
