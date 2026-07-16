import React, { useMemo, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { useFavorites } from "../context/FavoritesContext";
import { GIFTS } from "../data/gifts";
import { GiftLinksModal } from "../components/GiftLinksModal";
import { RenameModal } from "../components/RenameModal";
import { Gift } from "../types/domain";
import { colors, radius, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export function FavoritesScreen({ navigation }: Props) {
  const { favorites, toggleFavorite, renameFavorite, getCustomName } = useFavorites();
  const [linksGift, setLinksGift] = useState<Gift | null>(null);
  const [renameGift, setRenameGift] = useState<Gift | null>(null);

  const favoriteGifts = useMemo(() => {
    const byId = new Map(GIFTS.map((g) => [g.id, g]));
    return favorites
      .map((f) => byId.get(f.giftId))
      .filter((g): g is Gift => g !== undefined);
  }, [favorites]);

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
            favoriteGifts.map((gift, index) => {
              const customName = getCustomName(gift.id);
              return (
                <Animated.View
                  key={gift.id}
                  entering={FadeInUp.delay(index * 60).duration(350)}
                  style={styles.card}
                >
                  <LinearGradient colors={gift.couleurs} style={styles.badge}>
                    <Text style={styles.badgeEmoji}>{gift.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.cardBody}>
                    <View style={styles.nameRow}>
                      <Text style={styles.cardCustomName} numberOfLines={1}>
                        {customName ?? gift.nom}
                      </Text>
                      <Pressable
                        onPress={() => setRenameGift(gift)}
                        hitSlop={8}
                        style={styles.editBtn}
                      >
                        <Text style={styles.editIcon}>✏️</Text>
                      </Pressable>
                    </View>
                    {customName ? (
                      <Text style={styles.cardGiftName} numberOfLines={1}>
                        {gift.nom}
                      </Text>
                    ) : null}
                    <Text style={styles.cardPrice}>
                      {gift.prixMin === gift.prixMax
                        ? `${gift.prixMin} €`
                        : `${gift.prixMin} – ${gift.prixMax} €`}
                    </Text>
                    <View style={styles.cardActions}>
                      <Pressable onPress={() => setLinksGift(gift)}>
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
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>

      <GiftLinksModal
        gift={linksGift}
        visible={linksGift !== null}
        onClose={() => setLinksGift(null)}
      />

      <RenameModal
        visible={renameGift !== null}
        title="Renommer cette sauvegarde"
        initialValue={renameGift ? getCustomName(renameGift.id) : undefined}
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCustomName: { color: colors.text, fontWeight: "700", fontSize: 15, flexShrink: 1 },
  cardGiftName: { color: colors.textDim, fontSize: 12, marginTop: 1, marginBottom: 2 },
  editBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  editIcon: { fontSize: 14 },
  cardPrice: { color: colors.gold, fontWeight: "700", marginTop: 2, marginBottom: spacing.sm },
  cardActions: { flexDirection: "row", gap: 16 },
  actionText: { color: colors.primaryLight, fontWeight: "600", fontSize: 13 },
});
