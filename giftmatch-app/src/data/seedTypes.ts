import {
  AgeGroup,
  AlreadyHas,
  BudgetRange,
  Genre,
  Gift,
  GiftCategory,
  GiftType,
  Passion,
  Reaction,
  Relation,
  Style,
} from "../types/domain";

/**
 * Compact authoring format for a single gift idea. Only the creative fields
 * (name, description, price, category, emoji) are mandatory; every matching
 * dimension can be overridden but otherwise falls back to a sensible
 * category-level default computed in `expand.ts`. This keeps the 250+ hand
 * written ideas readable while still producing a fully tagged `Gift` object.
 */
export interface GiftSeed {
  nom: string;
  description: string;
  prixMin: number;
  prixMax: number;
  categorie: GiftCategory;
  emoji: string;
  passions?: Passion[];
  stylesExtra?: Style[];
  relations?: Relation[];
  ages?: AgeGroup[];
  reactions?: Reaction[];
  giftTypes?: GiftType[];
  genre?: Genre;
  originalite?: 1 | 2 | 3 | 4 | 5;
  utilite?: 1 | 2 | 3 | 4 | 5;
  sentimental?: boolean;
  premium?: boolean;
  experience?: boolean;
  saisons?: string[];
  occasions?: string[];
  evitePour?: AlreadyHas[];
}

export type ExpandedCatalog = Gift[];
