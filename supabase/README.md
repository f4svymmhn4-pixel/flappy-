# Base de données BETIZ

## Structure

```
supabase/
  migrations/   # schéma, dans l'ordre (0001_..., 0002_..., ...)
  seed/         # données de départ : catégories, 50 animaux, questions d'exemple
```

Tables principales : `profiles`, `animals`, `user_animals`, `categories`,
`questions`, `games`, `game_players`, `game_rounds`, `game_answers`,
`matchmaking_queue`, `token_transactions`. Le détail de chaque table et de
son rôle est commenté directement dans le fichier de migration qui la crée
(`comment on table ...`).

## Principes de sécurité (anti-triche)

- **`questions` n'a aucune policy RLS** : un client authentifié ne peut pas
  lire la table brute (donc jamais `correct_option` avant l'heure). La
  question d'une manche en cours sera servie par une RPC dédiée
  (`get_active_round_question`, étape Backend) qui masque la bonne réponse
  tant que la manche n'est pas révélée.
- **`games` / `game_players` / `game_rounds` / `game_answers`** n'ont que
  des policies `SELECT` (lecture pour les seuls participants, via la
  fonction `is_game_participant`). Aucune policy `INSERT`/`UPDATE` pour le
  rôle `authenticated` : score, timing de manche et validité des réponses
  sont exclusivement calculés côté serveur par des RPC `SECURITY DEFINER`
  (étape Backend), qui court-circuitent RLS car elles s'exécutent avec les
  droits du propriétaire de la table.
- **`profiles`** : un joueur peut modifier son pseudo/avatar, mais pas
  `tokens`/`xp`/`level`/les compteurs de stats — le trigger
  `profiles_protect_stats` rejette toute tentative venant d'un contexte non
  marqué `betiz.trusted` (uniquement positionné par les RPC serveur).
- **`token_transactions`** est un grand livre en écriture seule pour le
  client (lecture de son propre historique uniquement) ; chaque mouvement
  de jetons doit passer par une RPC qui écrit `profiles.tokens` et une ligne
  de `token_transactions` dans la même transaction.

Ces garanties ont été vérifiées avec un harnais de test local (Postgres +
stub `auth.users`/`auth.uid()`) simulant deux joueurs : tentative de
crédit de jetons en direct, pseudo dupliqué, lecture croisée d'une partie
privée à laquelle on ne participe pas, insertion directe dans
`game_answers`, et mise en file de matchmaking pour un autre joueur —
chaque tentative a été rejetée comme prévu.

## Appliquer les migrations

Avec la CLI Supabase, depuis un projet lié :

```sh
supabase link --project-ref <ref>
supabase db push
```

En local (Supabase CLI + Docker) :

```sh
supabase start
supabase db reset   # applique migrations/ puis seed/
```

## Import massif de questions

Le schéma est conçu pour monter à plusieurs dizaines de milliers de
questions. Format d'import (CSV avec en-tête) :

```csv
category_slug,difficulty,language,prompt,option_a,option_b,option_c,option_d,correct_option,source
animaux,easy,fr,"Quel est le plus grand animal terrestre ?","Le rhinocéros","L'éléphant d'Afrique","La girafe","L'hippopotame",1,"Encyclopédie X"
```

Import via `psql` :

```sh
psql "$DATABASE_URL" -c "\copy questions_import_staging FROM 'questions.csv' WITH (FORMAT csv, HEADER true)"
```

Les questions importées entrent avec `validation_status = 'pending'` : elles
ne sont sélectionnables en partie qu'une fois passées à `'approved'` (à la
main ou via un script de validation), ce qui garantit qu'aucune réponse
incorrecte marquée comme correcte ne peut atteindre un joueur sans revue.
La table de staging et le script de validation seront ajoutés avec l'outil
d'administration (étape Backend/Profil).

## Environnements

Ce dossier ne contient aucune valeur d'environnement. Les clés Supabase
côté client vivent dans `env/*.json` (voir `env/dev.json.example` à la
racine du repo), jamais ici.
