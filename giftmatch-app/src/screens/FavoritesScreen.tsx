import React, { useMemo } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { useFavorites } from "../context/FavoritesContext";
import { GIFTS } from "../data/gifts";
import { colors, radius, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export function FavoritesScreen({ navigation }: Props) {
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteGifts = useMemo(
    () => GIFTS.filter((g) => favoriteIds.includes(g.id)),
    [favoriteIds]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundAlt]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={[typography.h3, styles.headerTitle]}>Mes cadeaux sauvegardés</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {favoriteGifts.length === 0 ? (
            <Text style={styles.empty}>Aucun cadeau sauvegardé pour le moment.</Text>
          ) : (
            favoriteGifts.map((gift, index) => (
              <Animated.View
                key={gift.id}
                entering={FadeInUp.delay(index * 60).duration(350)}
                style={styles.card}
              >
                <LinearGradient colors={gift.couleurs} style={styles.badge}>
                  <Text style={styles.badgeEmoji}>{gift.emoji}</Text>
                </LinearGradient>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{gift.nom}</Text>
                  <Text style={styles.cardPrice}>
                    {gift.prixMin === gift.prixMax
                      ? `${gift.prixMin} €`
                      : `${gift.prixMin} – ${gift.prixMax} €`}
                  </Text>
                  <View style={styles.cardActions}>
                    <Pressable
                      onPress={() =>
                        Alert.alert(gift.nom, "Où veux-tu voir ce cadeau ?", [
                          ...gift.liens.map((lien) => ({
                            text: lien.boutique,
                            onPress: () => Linking.openURL(lien.url).catch(() => {}),
                          })),
                          { text: "Annuler", style: "cancel" as const },
                        ])
                      }
                    >
                      <Text style={styles.actionText}>🛒 Voir</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        Share.share({
                          message: `🎁 ${gift.nom} — ${gift.description}\nDéniché avec GiftMatch !`,
                        }).catch(() => {})
                      }
                    >
                      <Text style={styles.actionText}>↗️ Partager</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFavorite(gift.id)}>
                      <Text style={styles.actionText}>🗑️ Retirer</Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1, paddingHorizontal: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  backText: { color: colors.text, fontSize: 18 },
  headerTitle: { color: colors.text },
  content: { paddingBottom: spacing.xxl },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  badgeEmoji: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardName: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 2 },
  cardPrice: { color: colors.gold, fontWeight: "700", marginBottom: spacing.sm },
  cardActions: { flexDirection: "row", gap: 16 },
  actionText: { color: colors.primaryLight, fontWeight: "600", fontSize: 13 },
});
