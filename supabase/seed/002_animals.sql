-- 50 animals: 3 free starters, 47 unlockable with tokens. Cost increases
-- within each rarity tier, and tiers themselves get progressively more
-- expensive, so the first few unlocks come after dozens of games while the
-- legendary tier is a long-term goal (see ARCHITECTURE.md / game design
-- notes for the token-earning rates that make this pacing work).
insert into animals (slug, name, rarity, unlock_cost, is_starter, sort_order) values
  -- Starters — free
  ('renard', 'Renard', 'common', 0, true, 0),
  ('lapin', 'Lapin', 'common', 0, true, 1),
  ('chat', 'Chat', 'common', 0, true, 2),

  -- Common
  ('herisson', 'Hérisson', 'common', 150, false, 3),
  ('ecureuil', 'Écureuil', 'common', 220, false, 4),
  ('poule', 'Poule', 'common', 300, false, 5),
  ('cochon', 'Cochon', 'common', 380, false, 6),
  ('mouton', 'Mouton', 'common', 460, false, 7),
  ('chevre', 'Chèvre', 'common', 540, false, 8),
  ('chien', 'Chien', 'common', 620, false, 9),
  ('canard', 'Canard', 'common', 700, false, 10),
  ('souris', 'Souris', 'common', 800, false, 11),
  ('grenouille', 'Grenouille', 'common', 900, false, 12),
  ('tortue', 'Tortue', 'common', 1000, false, 13),
  ('hibou', 'Hibou', 'common', 1150, false, 14),
  ('perroquet', 'Perroquet', 'common', 1300, false, 15),
  ('raton_laveur', 'Raton laveur', 'common', 1500, false, 16),
  ('loutre', 'Loutre', 'common', 1700, false, 17),

  -- Rare
  ('panda', 'Panda', 'rare', 1900, false, 18),
  ('koala', 'Koala', 'rare', 2100, false, 19),
  ('singe', 'Singe', 'rare', 2300, false, 20),
  ('paresseux', 'Paresseux', 'rare', 2500, false, 21),
  ('dauphin', 'Dauphin', 'rare', 2700, false, 22),
  ('phoque', 'Phoque', 'rare', 2900, false, 23),
  ('pingouin', 'Pingouin', 'rare', 3100, false, 24),
  ('flamant_rose', 'Flamant rose', 'rare', 3300, false, 25),
  ('zebre', 'Zèbre', 'rare', 3600, false, 26),
  ('girafe', 'Girafe', 'rare', 3900, false, 27),
  ('kangourou', 'Kangourou', 'rare', 4200, false, 28),
  ('bison', 'Bison', 'rare', 4500, false, 29),
  ('renne', 'Renne', 'rare', 4800, false, 30),
  ('lynx', 'Lynx', 'rare', 5100, false, 31),
  ('suricate', 'Suricate', 'rare', 5300, false, 32),
  ('fennec', 'Fennec', 'rare', 5500, false, 33),

  -- Epic
  ('tigre', 'Tigre', 'epic', 6000, false, 34),
  ('lion', 'Lion', 'epic', 6600, false, 35),
  ('loup', 'Loup', 'epic', 7200, false, 36),
  ('ours', 'Ours', 'epic', 7800, false, 37),
  ('gorille', 'Gorille', 'epic', 8400, false, 38),
  ('rhinoceros', 'Rhinocéros', 'epic', 9000, false, 39),
  ('elephant', 'Éléphant', 'epic', 9600, false, 40),
  ('hippopotame', 'Hippopotame', 'epic', 10200, false, 41),
  ('requin', 'Requin', 'epic', 10800, false, 42),
  ('aigle', 'Aigle', 'epic', 11400, false, 43),
  ('panthere', 'Panthère', 'epic', 12000, false, 44),

  -- Legendary
  ('jaguar', 'Jaguar', 'legendary', 14000, false, 45),
  ('guepard', 'Guépard', 'legendary', 16500, false, 46),
  ('baleine', 'Baleine', 'legendary', 19000, false, 47),
  ('dragon_de_komodo', 'Dragon de Komodo', 'legendary', 22000, false, 48),
  ('narval', 'Narval', 'legendary', 25000, false, 49)
on conflict (slug) do nothing;
