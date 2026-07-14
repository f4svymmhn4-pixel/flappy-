-- Reused by every RPC that seats a player into a game (create_private_game,
-- join_private_game, join_matchmaking, start_solo_game) so the "has a
-- pseudo, has actually unlocked this animal" check exists in exactly one
-- place.
create or replace function assert_ready_to_play(p_animal_id uuid)
returns void
language plpgsql
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  if not exists (select 1 from profiles where id = v_user and pseudo is not null) then
    raise exception 'pseudo_required';
  end if;

  if not exists (select 1 from user_animals where user_id = v_user and animal_id = p_animal_id) then
    raise exception 'animal_not_unlocked';
  end if;
end;
$$;

-- 6-character join code for private games. The hex alphabet from md5 is a
-- subset of the A-Z0-9 the games_room_code_format check allows.
create or replace function generate_room_code()
returns text
language plpgsql
as $$
declare
  v_code text;
begin
  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from games where room_code = v_code);
  end loop;
  return v_code;
end;
$$;

-- Picks the next question for a round: matches the game's difficulty (and
-- category, if the game pinned one), never repeats a question already used
-- in this same game, and mildly favors less-seen questions across the
-- whole bank via times_used. Not exposed to clients — it's only ever
-- invoked from inside start_game_internal/advance_game, which already run
-- as the trusted definer.
create or replace function pick_question_for_round(p_game_id uuid)
returns uuid
language plpgsql
as $$
declare
  v_game games;
  v_question_id uuid;
begin
  select * into v_game from games where id = p_game_id;

  select id into v_question_id
  from questions
  where validation_status = 'approved'
    and difficulty = v_game.difficulty
    and (v_game.category_id is null or category_id = v_game.category_id)
    and id not in (select question_id from game_rounds where game_id = p_game_id)
  order by times_used asc, random()
  limit 1;

  if v_question_id is null then
    raise exception 'no_question_available';
  end if;

  update questions set times_used = times_used + 1 where id = v_question_id;

  return v_question_id;
end;
$$;
