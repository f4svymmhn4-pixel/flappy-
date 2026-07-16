import React, { useMemo, useState } from "react";
import { Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { useQuiz } from "../context/QuizContext";
import { useFavorites } from "../context/FavoritesContext";
import { GIFTS } from "../data/gifts";
import { getTopGifts, scoreGift } from "../engine/scoring";
import { buildPersonalizedReason } from "../engine/reason";
import { GiftCard } from "../components/GiftCard";
import { GiftLinksModal } from "../components/GiftLinksModal";
import { RenameModal } from "../components/RenameModal";
import { GradientButton } from "../components/GradientButton";
import { Gift } from "../types/domain";
import { colors, gradients, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export function ResultsScreen({ navigation }: Props) {
  const { answers, reset } = useQuiz();
  const { isFavorite, toggleFavorite, renameFavorite } = useFavorites();
  const [linksGift, setLinksGift] = useState<Gift | null>(null);
  const [renameGift, setRenameGift] = useState<Gift | null>(null);

  const results = useMemo(() => {
    const top = getTopGifts(GIFTS, answers, 3);
    return top.map((scored) => {
      const { breakdown } = scoreGift(scored.gift, answers);
      return {
        scored,
        reason: buildPersonalizedReason(scored.gift, answers, breakdown),
      };
    });
  }, [answers]);

  const handleToggleSave = (gift: Gift) => {
    const wasSaved = isFavorite(gift.id);
    toggleFavorite(gift.id);
    if (!wasSaved) {
      setRenameGift(gift);
    }
  };

  const handleShare = (gift: Gift) => {
    Share.share({
      message: `🎁 ${gift.nom} — ${gift.description}\nDéniché avec GiftMatch !`,
    }).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundAlt]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <Text style={styles.title}>🎁 TES 3 CADEAUX PARFAITS</Text>
            <Text style={styles.subtitle}>
              Sélectionnés et justifiés à partir de tes réponses.
            </Text>
          </Animated.View>

          {results.map((r, index) => (
            <GiftCard
              key={r.scored.gift.id}
              scored={r.scored}
              rank={(index + 1) as 1 | 2 | 3}
              reason={r.reason}
              saved={isFavorite(r.scored.gift.id)}
              onOpenLinks={() => setLinksGift(r.scored.gift)}
              onSave={() => handleToggleSave(r.scored.gift)}
              onShare={() => handleShare(r.scored.gift)}
              index={index}
            />
          ))}

          <View style={styles.footer}>
            <GradientButton
              label="🔄 Refaire le questionnaire"
              size="medium"
              colorsOverride={gradients.card as unknown as [string, string]}
              onPress={() => {
                reset();
                navigation.navigate("Questionnaire");
              }}
            />
            <Text style={styles.homeLink} onPress={() => navigation.popToTop()}>
              ← Retour à l'accueil
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <GiftLinksModal
        gift={linksGift}
        visible={linksGift !== null}
        onClose={() => setLinksGift(null)}
      />

      <RenameModal
        visible={renameGift !== null}
        title="Donne un nom à cette sauvegarde"
        placeholder='Ex : "Cadeau maman", "Idée Noël 2026"...'
        onCancel={() => setRenameGift(null)}
        onSave={(name) => {
          if (renameGift) renameFavorite(renameGift.id, name);
          setRenameGift(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.lg, alignItems: "center" },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  homeLink: {
    color: colors.textMuted,
    marginTop: spacing.md,
    fontWeight: "600",
  },
});
