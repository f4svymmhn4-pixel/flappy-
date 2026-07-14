-- One row per authenticated user (anonymous or upgraded), 1:1 with auth.users.
-- Created automatically by the handle_new_user trigger (0008_functions_triggers.sql)
-- the moment a user signs in anonymously, with pseudo left null until the
-- mandatory onboarding step claims one.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo citext unique,
  avatar_animal_id uuid references animals (id),
  tokens integer not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  games_played integer not null default 0,
  games_won integer not null default 0,
  total_correct_answers integer not null default 0,
  total_answers integer not null default 0,
  avg_response_time_ms integer not null default 0,
  is_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_pseudo_length check (
    pseudo is null or char_length(pseudo::text) between 3 and 20
  ),
  constraint profiles_pseudo_charset check (
    pseudo is null or pseudo::text ~ '^[a-zA-Z0-9_]+$'
  ),
  constraint profiles_tokens_check check (tokens >= 0),
  constraint profiles_xp_check check (xp >= 0),
  constraint profiles_level_check check (level >= 1),
  constraint profiles_games_won_check check (games_won <= games_played),
  constraint profiles_correct_answers_check check (total_correct_answers <= total_answers)
);

create index profiles_pseudo_idx on profiles (pseudo);

comment on table profiles is
  'App-level user profile. tokens/xp/level/stat columns are only ever '
  'mutated by SECURITY DEFINER RPCs — see profiles_protect_stats trigger.';
comment on column profiles.pseudo is
  'Unique display name, claimed once during onboarding. citext for '
  'case-insensitive uniqueness ("Renard" and "renard" cannot coexist).';
