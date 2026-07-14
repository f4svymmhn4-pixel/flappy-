-- Groups up to 5 same-difficulty queued players into a public game and
-- starts it immediately. Guarded by an advisory lock keyed on the
-- difficulty so two players queuing at the same instant can't both see
-- "5 waiting" and each spin up a duplicate game from overlapping rows.
-- Internal only (called from join_matchmaking); partial-group matching
-- after a queue timeout is a scheduled job added in the Matchmaking step.
create or replace function try_match_queue(p_difficulty difficulty_level)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game_id uuid;
  v_count int;
  v_row record;
begin
  perform pg_advisory_xact_lock(hashtext('matchmaking:' || p_difficulty::text));

  select count(*) into v_count
  from matchmaking_queue where difficulty = p_difficulty and status = 'waiting';
  if v_count < 5 then
    return null;
  end if;

  insert into games (visibility, difficulty, status, is_solo)
  values ('public', p_difficulty, 'waiting', false)
  returning id into v_game_id;

  for v_row in
    select user_id, animal_id from matchmaking_queue
    where difficulty = p_difficulty and status = 'waiting'
    order by queued_at asc
    limit 5
    for update
  loop
    insert into game_players (game_id, user_id, animal_id)
    values (v_game_id, v_row.user_id, v_row.animal_id);

    update matchmaking_queue
    set status = 'matched', matched_game_id = v_game_id
    where user_id = v_row.user_id;
  end loop;

  perform start_game_internal(v_game_id);

  return v_game_id;
end;
$$;

create or replace function join_matchmaking(p_difficulty difficulty_level, p_animal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_game_id uuid;
begin
  perform assert_ready_to_play(p_animal_id);

  insert into matchmaking_queue (user_id, difficulty, animal_id)
  values (v_user, p_difficulty, p_animal_id)
  on conflict (user_id) do update
    set difficulty = excluded.difficulty,
        animal_id = excluded.animal_id,
        status = 'waiting',
        queued_at = now(),
        matched_game_id = null;

  v_game_id := try_match_queue(p_difficulty);

  if v_game_id is not null then
    return jsonb_build_object('matched', true, 'game_id', v_game_id);
  end if;

  return jsonb_build_object('matched', false);
end;
$$;

grant execute on function join_matchmaking(difficulty_level, uuid) to authenticated;

create or replace function leave_matchmaking()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from matchmaking_queue where user_id = auth.uid() and status = 'waiting';
end;
$$;

grant execute on function leave_matchmaking() to authenticated;
