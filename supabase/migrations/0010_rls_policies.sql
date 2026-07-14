-- Row Level Security. Default-deny: every table below has RLS enabled and
-- only the policies listed are allowed — anything not explicitly granted
-- (e.g. writing games/game_players/game_rounds/game_answers, or reading
-- questions at all) is rejected for the `authenticated` and `anon` roles
-- and only reachable through SECURITY DEFINER RPCs added in the Backend
-- step, which run as the table owner and bypass RLS.

alter table profiles enable row level security;
alter table animals enable row level security;
alter table user_animals enable row level security;
alter table categories enable row level security;
alter table questions enable row level security;
alter table games enable row level security;
alter table game_players enable row level security;
alter table game_rounds enable row level security;
alter table game_answers enable row level security;
alter table matchmaking_queue enable row level security;
alter table token_transactions enable row level security;

-- profiles: public read (pseudo/stats are shown to opponents), self update
-- of the non-protected columns only (enforced by profiles_protect_stats).
create policy profiles_select_all
  on profiles for select
  to authenticated
  using (true);

create policy profiles_update_own
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- animals: public catalog, read-only for clients.
create policy animals_select_all
  on animals for select
  to authenticated
  using (true);

-- user_animals: a player can only see their own unlocked catalog.
create policy user_animals_select_own
  on user_animals for select
  to authenticated
  using (user_id = auth.uid());

-- categories: public read-only.
create policy categories_select_all
  on categories for select
  to authenticated
  using (true);

-- questions: intentionally no policies at all for authenticated/anon.
-- Delivered to clients exclusively through the get_active_round_question
-- RPC (Backend step), which strips correct_option/explanation/source
-- until the round is revealed.

-- games: visible if it's an open public lobby, or the caller is already a
-- participant (covers private games joined by room_code and in-progress
-- games).
create policy games_select_visible
  on games for select
  to authenticated
  using (
    (visibility = 'public' and status = 'waiting')
    or is_game_participant(id)
  );

-- game_players / game_rounds / game_answers: visible only to participants
-- of that game. No client-side writes anywhere in this cluster — score,
-- round timing and answer correctness are all server-computed.
create policy game_players_select_participant
  on game_players for select
  to authenticated
  using (is_game_participant(game_id));

create policy game_rounds_select_participant
  on game_rounds for select
  to authenticated
  using (is_game_participant(game_id));

create policy game_answers_select_participant
  on game_answers for select
  to authenticated
  using (
    exists (
      select 1 from game_rounds r
      where r.id = game_answers.round_id
        and is_game_participant(r.game_id)
    )
  );

-- matchmaking_queue: a player manages only their own queue entry. Status
-- transitions to 'matched' happen exclusively inside the match_players RPC.
create policy matchmaking_queue_select_own
  on matchmaking_queue for select
  to authenticated
  using (user_id = auth.uid());

create policy matchmaking_queue_insert_own
  on matchmaking_queue for insert
  to authenticated
  with check (user_id = auth.uid() and status = 'waiting');

create policy matchmaking_queue_delete_own
  on matchmaking_queue for delete
  to authenticated
  using (user_id = auth.uid());

-- token_transactions: read-only audit trail, own rows only.
create policy token_transactions_select_own
  on token_transactions for select
  to authenticated
  using (user_id = auth.uid());
