create table matchmaking_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  difficulty difficulty_level not null,
  status matchmaking_status not null default 'waiting',
  queued_at timestamptz not null default now(),
  matched_game_id uuid references games (id)
);

create index matchmaking_queue_lookup_idx on matchmaking_queue (difficulty, status, queued_at);

comment on table matchmaking_queue is
  'Public matchmaking queue. One row per waiting user; the match_players '
  'RPC (Backend step) groups up to 5 same-difficulty rows into a game.';

create table token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  amount integer not null,
  balance_after integer not null,
  type token_transaction_type not null,
  game_id uuid references games (id),
  animal_id uuid references animals (id),
  created_at timestamptz not null default now(),

  constraint token_transactions_amount_not_zero check (amount <> 0),
  constraint token_transactions_balance_check check (balance_after >= 0)
);

create index token_transactions_user_id_idx on token_transactions (user_id, created_at desc);

comment on table token_transactions is
  'Append-only ledger of every token grant/spend. profiles.tokens is the '
  'authoritative live balance; this table is the audit trail behind it — '
  'both are written atomically by the same RPC that changes the balance.';
