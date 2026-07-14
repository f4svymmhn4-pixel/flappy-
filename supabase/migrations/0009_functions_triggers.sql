-- Generic updated_at maintenance, reused by every table that has the column.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger questions_set_updated_at
  before update on questions
  for each row execute function set_updated_at();

-- Anti-cheat: a player can update their own pseudo/avatar (see RLS policy),
-- but tokens/xp/level/stat columns must only ever move through a trusted
-- SECURITY DEFINER RPC (added in the Backend step). Those RPCs call
-- `perform set_config('betiz.trusted', 'on', true);` before writing; any
-- other write path hits this trigger and is rejected outright.
create or replace function profiles_protect_stats()
returns trigger
language plpgsql
as $$
begin
  if current_setting('betiz.trusted', true) = 'on' then
    return new;
  end if;

  if new.tokens is distinct from old.tokens
    or new.xp is distinct from old.xp
    or new.level is distinct from old.level
    or new.games_played is distinct from old.games_played
    or new.games_won is distinct from old.games_won
    or new.total_correct_answers is distinct from old.total_correct_answers
    or new.total_answers is distinct from old.total_answers
    or new.avg_response_time_ms is distinct from old.avg_response_time_ms
    or new.is_banned is distinct from old.is_banned
  then
    raise exception
      'profiles: tokens/xp/level/stat columns can only be changed by trusted server-side functions';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_stats_trigger
  before update on profiles
  for each row execute function profiles_protect_stats();

-- Bridges Supabase Auth to the app's profile: every new auth.users row
-- (created on anonymous sign-in) gets a matching profiles row and the 3
-- starter animals, atomically, before the client can do anything else.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('betiz.trusted', 'on', true);

  insert into public.profiles (id) values (new.id);

  insert into public.user_animals (user_id, animal_id, source)
  select new.id, id, 'starter'
  from public.animals
  where is_starter = true;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Shared by RLS policies on games/game_players/game_rounds/game_answers so
-- "am I in this game" is expressed once instead of repeated per policy.
-- SECURITY DEFINER + a fixed search_path avoids RLS recursing back into
-- game_players while evaluating game_players' own policy.
create or replace function is_game_participant(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from game_players
    where game_id = p_game_id and user_id = auth.uid()
  );
$$;
