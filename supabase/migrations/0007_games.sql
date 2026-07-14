create table games (
  id uuid primary key default gen_random_uuid(),
  visibility game_visibility not null default 'public',
  room_code text unique,
  difficulty difficulty_level not null,
  category_id uuid references categories (id),
  status game_status not null default 'waiting',
  max_players smallint not null default 5,
  min_players smallint not null default 2,
  is_solo boolean not null default false,
  current_round smallint not null default 0,
  total_rounds smallint not null default 5,
  round_duration_seconds smallint not null default 10,
  host_id uuid references profiles (id),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz,

  constraint games_room_code_format check (
    room_code is null or room_code ~ '^[A-Z0-9]{6}$'
  ),
  constraint games_visibility_room_code check (
    (visibility = 'private' and room_code is not null)
    or (visibility = 'public' and room_code is null)
  ),
  constraint games_player_bounds check (min_players between 2 and 5 and max_players between min_players and 5),
  constraint games_rounds_check check (total_rounds > 0),
  constraint games_round_duration_check check (round_duration_seconds > 0),
  constraint games_current_round_check check (current_round between 0 and total_rounds)
);

create index games_status_idx on games (status);
create index games_matchmaking_idx on games (difficulty, status) where visibility = 'public';

comment on table games is
  'A single match: up to 5 players (or 1 human + 4 bots in solo mode), '
  '5 rounds of 10s by default. room_code is a 6-character join code, '
  'set only for private games.';

create table game_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games (id) on delete cascade,
  user_id uuid references profiles (id),
  is_bot boolean not null default false,
  bot_difficulty difficulty_level,
  animal_id uuid not null references animals (id),
  status game_player_status not null default 'joined',
  score integer not null default 0,
  correct_answers smallint not null default 0,
  joined_at timestamptz not null default now(),
  left_at timestamptz,

  constraint game_players_identity_check check (
    (is_bot and user_id is null and bot_difficulty is not null)
    or (not is_bot and user_id is not null and bot_difficulty is null)
  ),
  constraint game_players_score_check check (score >= 0)
);

create unique index game_players_unique_user on game_players (game_id, user_id) where user_id is not null;
create unique index game_players_unique_animal on game_players (game_id, animal_id);
create index game_players_game_id_idx on game_players (game_id);
create index game_players_user_id_idx on game_players (user_id);

comment on table game_players is
  'One row per participant (human or bot) in a game, holding their chosen '
  'animal and running score for that game only.';

create table game_rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games (id) on delete cascade,
  round_number smallint not null,
  question_id uuid not null references questions (id),
  status round_status not null default 'pending',
  started_at timestamptz,
  ends_at timestamptz,
  revealed_at timestamptz,

  constraint game_rounds_round_number_check check (round_number between 1 and 20),
  constraint game_rounds_timing_check check (
    (status = 'pending' and started_at is null)
    or (status <> 'pending' and started_at is not null)
  )
);

create unique index game_rounds_unique_number on game_rounds (game_id, round_number);
create index game_rounds_game_id_idx on game_rounds (game_id);

comment on table game_rounds is
  'One row per round of a game. ends_at is computed server-side when the '
  'round starts so every client counts down against the same deadline.';

create table game_answers (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references game_rounds (id) on delete cascade,
  game_player_id uuid not null references game_players (id) on delete cascade,
  selected_option smallint,
  is_correct boolean,
  answered_at timestamptz,
  response_time_ms integer,
  points_awarded smallint not null default 0,
  rank_when_correct smallint,

  constraint game_answers_option_range check (selected_option is null or selected_option between 0 and 3),
  constraint game_answers_response_time_check check (response_time_ms is null or response_time_ms >= 0),
  constraint game_answers_points_check check (points_awarded between 0 and 3)
);

create unique index game_answers_unique_submission on game_answers (round_id, game_player_id);
create index game_answers_round_id_idx on game_answers (round_id);

comment on table game_answers is
  'A player''s answer for a round. response_time_ms is always computed '
  'server-side as now() - round.started_at inside the submit_answer RPC — '
  'a client-supplied timestamp is never trusted for scoring (anti-cheat).';
