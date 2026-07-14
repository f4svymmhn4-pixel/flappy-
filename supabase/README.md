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

## Temps réel

`games`, `game_players`, `game_rounds` et `game_answers` sont publiées sur
`supabase_realtime` avec `replica identity full` (migration
`0021_realtime_publication.sql`) — nécessaire pour que
`supabase_flutter`'s `.stream()` reçoive la ligne complète sur chaque
`UPDATE`, pas seulement les colonnes modifiées. Les policies RLS
s'appliquent aussi aux changements diffusés en temps réel : un client ne
reçoit jamais un événement pour une ligne qu'il n'a pas le droit de lire.
`questions` n'est volontairement pas publiée (elle n'a de toute façon
aucune policy `SELECT`).

## Principes de sécurité (anti-triche)

- **`questions` n'a aucune policy RLS** : un client authentifié ne peut pas
  lire la table brute (donc jamais `correct_option` avant l'heure). La
  question d'une manche en cours est servie par `get_round_question(round_id)`,
  qui vérifie que l'appelant participe à la partie et ne renvoie
  `correct_option` que si la manche est `revealed`/`completed`.
- **`games` / `game_players` / `game_rounds` / `game_answers`** n'ont que
  des policies `SELECT` (lecture pour les seuls participants, via la
  fonction `is_game_participant`). Aucune policy `INSERT`/`UPDATE` pour le
  rôle `authenticated` : score, timing de manche et validité des réponses
  sont exclusivement calculés côté serveur par des RPC `SECURITY DEFINER`,
  qui court-circuitent RLS car elles s'exécutent avec les droits du
  propriétaire de la table.
- **`profiles`** : un joueur peut modifier son pseudo/avatar, mais pas
  `tokens`/`xp`/`level`/les compteurs de stats — le trigger
  `profiles_protect_stats` rejette toute tentative venant d'un contexte non
  marqué `betiz.trusted` (uniquement positionné par les RPC serveur).
- **`token_transactions`** est un grand livre en écriture seule pour le
  client (lecture de son propre historique uniquement) ; chaque mouvement
  de jetons doit passer par une RPC qui écrit `profiles.tokens` et une ligne
  de `token_transactions` dans la même transaction.

Ces garanties ont été vérifiées avec un harnais de test local (Postgres +
stub `auth.users`/`auth.uid()`) simulant plusieurs joueurs : tentative de
crédit de jetons en direct, pseudo dupliqué, lecture croisée d'une partie
privée à laquelle on ne participe pas, insertion directe dans
`game_answers`, lecture d'une question par un non-participant, mise en
file de matchmaking pour un autre joueur, déblocage d'un animal sans
assez de jetons ou en double — chaque tentative a été rejetée comme prévu.

## RPC exposées au client

Toute la logique de partie passe par ces fonctions (`SECURITY DEFINER`,
`grant execute ... to authenticated`) ; le reste (tables `games`,
`game_players`, `game_rounds`, `game_answers`, `questions`) n'accepte
aucune écriture directe du client.

| Fonction | Rôle |
|---|---|
| `create_private_game(difficulty, animal_id)` | Crée une partie privée + code à 6 caractères, l'appelant devient hôte |
| `join_private_game(room_code, animal_id)` | Rejoint une partie privée en attente |
| `start_private_game(game_id)` | L'hôte démarre la partie (min. 2 joueurs) |
| `leave_game(game_id)` | Quitte une partie en cours ; la partie continue pour les autres |
| `join_matchmaking(difficulty, animal_id)` | Rejoint la file publique ; forme et démarre la partie dès 5 joueurs |
| `leave_matchmaking()` | Quitte la file d'attente |
| `start_solo_game(difficulty, animal_id)` | Démarre une partie contre 4 bots au niveau choisi |
| `get_round_question(round_id)` | Renvoie la question de la manche ; `correct_option` reste `null` tant que la manche n'est pas révélée |
| `submit_answer(round_id, selected_option)` | Enregistre/écrase la réponse du joueur ; le temps de réponse est calculé côté serveur, jamais fourni par le client |
| `reveal_round(round_id)` | Fige la manche une fois le temps écoulé, calcule qui a trouvé la bonne réponse et dans quel ordre (3/2/1/0 points) |
| `advance_game(game_id)` | Appelée après l'animation de classement ; démarre la manche suivante ou termine la partie |
| `unlock_animal(animal_id)` | Achète un animal si le solde de jetons suffit |

`reveal_round`/`advance_game` sont conçues pour être appelées par
n'importe quel client participant (celle ou celui dont le minuteur local
atteint zéro en premier) : chacune revérifie l'heure serveur et est
idempotente, donc un double appel ou un appel prématuré ne fait jamais
rien de dangereux.

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
