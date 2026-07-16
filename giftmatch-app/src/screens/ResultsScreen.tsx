import React, { useMemo } from "react";
import { Alert, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { useQuiz } from "../context/QuizContext";
import { useFavorites } from "../context/FavoritesContext";
import { GIFTS } from "../data/gifts";
import { getTopGifts, scoreGift } from "../engine/scoring";
import { buildPersonalizedReason } from "../engine/reason";
import { GiftCard } from "../components/GiftCard";
import { GradientButton } from "../components/GradientButton";
import { colors, gradients, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export function ResultsScreen({ navigation }: Props) {
  const { answers, reset } = useQuiz();
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const handleOpenLinks = (gift: (typeof results)[number]["scored"]["gift"]) => {
    Alert.alert(
      gift.nom,
      "Où veux-tu voir ce cadeau ?",
      [
        ...gift.liens.map((lien) => ({
          text: lien.boutique,
          onPress: () => Linking.openURL(lien.url).catch(() => {}),
        })),
        { text: "Annuler", style: "cancel" as const },
      ]
    );
  };

  const handleShare = (gift: (typeof results)[number]["scored"]["gift"]) => {
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
              onOpenLinks={() => handleOpenLinks(r.scored.gift)}
              onSave={() => toggleFavorite(r.scored.gift.id)}
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
