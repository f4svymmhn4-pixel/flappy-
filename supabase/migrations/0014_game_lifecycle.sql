create or replace function create_private_game(p_difficulty difficulty_level, p_animal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_game games;
begin
  perform assert_ready_to_play(p_animal_id);

  insert into games (visibility, room_code, difficulty, status, host_id)
  values ('private', generate_room_code(), p_difficulty, 'waiting', v_user)
  returning * into v_game;

  insert into game_players (game_id, user_id, animal_id)
  values (v_game.id, v_user, p_animal_id);

  return jsonb_build_object('game_id', v_game.id, 'room_code', v_game.room_code);
end;
$$;

grant execute on function create_private_game(difficulty_level, uuid) to authenticated;

create or replace function join_private_game(p_room_code text, p_animal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_game games;
  v_player_count int;
begin
  perform assert_ready_to_play(p_animal_id);

  -- Row lock serializes concurrent joins to the same game so the capacity
  -- and animal-uniqueness checks below can't race.
  select * into v_game from games where room_code = upper(p_room_code) for update;
  if not found then
    raise exception 'game_not_found';
  end if;
  if v_game.status <> 'waiting' then
    raise exception 'game_already_started';
  end if;

  select count(*) into v_player_count
  from game_players where game_id = v_game.id and status <> 'left';
  if v_player_count >= v_game.max_players then
    raise exception 'game_full';
  end if;

  if exists (select 1 from game_players where game_id = v_game.id and animal_id = p_animal_id) then
    raise exception 'animal_taken';
  end if;

  insert into game_players (game_id, user_id, animal_id)
  values (v_game.id, v_user, p_animal_id)
  on conflict (game_id, user_id) where user_id is not null
  do update set status = 'joined', left_at = null, animal_id = excluded.animal_id;

  return jsonb_build_object('game_id', v_game.id);
end;
$$;

grant execute on function join_private_game(text, uuid) to authenticated;

-- Actual state transition, shared by start_private_game (host-triggered)
-- and the matchmaking RPC (system-triggered once 5 players are queued).
-- Idempotent: a second call on an already-started game is a silent no-op,
-- so two racing callers can't double-start a round.
create or replace function start_game_internal(p_game_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game games;
  v_question_id uuid;
begin
  select * into v_game from games where id = p_game_id for update;
  if v_game.status <> 'waiting' then
    return;
  end if;

  update games set status = 'in_progress', started_at = now(), current_round = 1
  where id = p_game_id;

  v_question_id := pick_question_for_round(p_game_id);

  insert into game_rounds (game_id, round_number, question_id, status, started_at, ends_at)
  values (
    p_game_id, 1, v_question_id, 'active', now(),
    now() + make_interval(secs => v_game.round_duration_seconds)
  );

  perform simulate_bot_answers(p_game_id, 1::smallint);
end;
$$;

create or replace function start_private_game(p_game_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game games;
  v_player_count int;
begin
  select * into v_game from games where id = p_game_id;
  if v_game is null then
    raise exception 'game_not_found';
  end if;
  if v_game.host_id <> auth.uid() then
    raise exception 'not_host';
  end if;
  if v_game.status <> 'waiting' then
    raise exception 'game_already_started';
  end if;

  select count(*) into v_player_count
  from game_players where game_id = p_game_id and status <> 'left';
  if v_player_count < v_game.min_players then
    raise exception 'not_enough_players';
  end if;

  perform start_game_internal(p_game_id);
end;
$$;

grant execute on function start_private_game(uuid) to authenticated;

create or replace function leave_game(p_game_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update game_players
  set status = 'left', left_at = now()
  where game_id = p_game_id and user_id = auth.uid();
end;
$$;

grant execute on function leave_game(uuid) to authenticated;

comment on function leave_game(uuid) is
  'Voluntary leave. The game (and its remaining players'' rounds) keeps '
  'going — see finish_game, which simply excludes left players from '
  'the reward pass.';
