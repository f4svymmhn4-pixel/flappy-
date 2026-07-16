import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteEntry } from "../types/domain";

const STORAGE_KEY = "giftmatch:favorites";

interface FavoritesContextValue {
  favorites: FavoriteEntry[];
  isFavorite: (giftId: string) => boolean;
  toggleFavorite: (giftId: string) => void;
  renameFavorite: (giftId: string, customName: string) => void;
  getCustomName: (giftId: string) => string | undefined;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

/** Old builds stored a plain string[] of gift ids; upgrade it in place. */
function normalizeStored(raw: unknown): FavoriteEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) =>
    typeof item === "string"
      ? { giftId: item, savedAt: Date.now() }
      : (item as FavoriteEntry)
  );
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavorites(normalizeStored(JSON.parse(raw)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite: (giftId: string) => favorites.some((f) => f.giftId === giftId),
      toggleFavorite: (giftId: string) =>
        setFavorites((prev) =>
          prev.some((f) => f.giftId === giftId)
            ? prev.filter((f) => f.giftId !== giftId)
            : [...prev, { giftId, savedAt: Date.now() }]
        ),
      renameFavorite: (giftId: string, customName: string) =>
        setFavorites((prev) =>
          prev.map((f) =>
            f.giftId === giftId ? { ...f, customName: customName.trim() || undefined } : f
          )
        ),
      getCustomName: (giftId: string) =>
        favorites.find((f) => f.giftId === giftId)?.customName,
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
