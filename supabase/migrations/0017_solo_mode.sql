-- Solo: the human plus 4 bots, all at the chosen difficulty ("le niveau
-- des bots dépend de la difficulté"). Starts immediately — there is no
-- lobby wait in solo mode.
create or replace function start_solo_game(p_difficulty difficulty_level, p_animal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_game_id uuid;
  v_bot_animal_ids uuid[];
begin
  perform assert_ready_to_play(p_animal_id);

  insert into games (visibility, difficulty, status, is_solo)
  values ('public', p_difficulty, 'waiting', true)
  returning id into v_game_id;

  insert into game_players (game_id, user_id, animal_id)
  values (v_game_id, v_user, p_animal_id);

  select array_agg(id) into v_bot_animal_ids
  from (select id from animals where id <> p_animal_id order by random() limit 4) as pick;

  insert into game_players (game_id, is_bot, bot_difficulty, animal_id)
  select v_game_id, true, p_difficulty, unnest(v_bot_animal_ids);

  perform start_game_internal(v_game_id);

  return jsonb_build_object('game_id', v_game_id);
end;
$$;

grant execute on function start_solo_game(difficulty_level, uuid) to authenticated;
