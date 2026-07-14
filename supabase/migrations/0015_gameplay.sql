-- The core anti-cheat function: response_time_ms is always computed here
-- from round.started_at (server clock), never accepted from the client.
-- Re-submitting while the round is still active overwrites the previous
-- selection — the "animal changes its mind and runs to the new tile" flow
-- — and answered_at moves to the new submission time, which is exactly
-- the timestamp used for speed ranking at reveal.
create or replace function submit_answer(p_round_id uuid, p_selected_option smallint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_round game_rounds;
  v_player game_players;
  v_response_time_ms int;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;
  if p_selected_option not between 0 and 3 then
    raise exception 'invalid_option';
  end if;

  select * into v_round from game_rounds where id = p_round_id;
  if v_round is null then
    raise exception 'round_not_found';
  end if;
  if v_round.status <> 'active' or now() > v_round.ends_at then
    raise exception 'round_not_active';
  end if;

  select * into v_player from game_players where game_id = v_round.game_id and user_id = v_user;
  if v_player is null then
    raise exception 'not_a_participant';
  end if;

  v_response_time_ms := greatest(0, extract(epoch from (now() - v_round.started_at)) * 1000)::int;

  insert into game_answers (round_id, game_player_id, selected_option, answered_at, response_time_ms)
  values (p_round_id, v_player.id, p_selected_option, now(), v_response_time_ms)
  on conflict (round_id, game_player_id) do update
    set selected_option = excluded.selected_option,
        answered_at = excluded.answered_at,
        response_time_ms = excluded.response_time_ms;

  return jsonb_build_object('ok', true, 'response_time_ms', v_response_time_ms);
end;
$$;

grant execute on function submit_answer(uuid, smallint) to authenticated;

-- Solo-mode opponents. Bots lock in one answer shortly after the round
-- starts (no "changing their mind"); accuracy and thinking time scale with
-- bot_difficulty so Easy/Medium/Hard actually feel different to play
-- against. Internal only — never granted to authenticated.
create or replace function simulate_bot_answers(p_game_id uuid, p_round_number smallint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_round game_rounds;
  v_question questions;
  v_bot record;
  v_correct_probability numeric;
  v_will_be_correct boolean;
  v_selected smallint;
  v_delay_ms int;
  v_max_delay_ms int;
begin
  select * into v_round from game_rounds where game_id = p_game_id and round_number = p_round_number;
  if v_round is null then
    return;
  end if;

  select * into v_question from questions where id = v_round.question_id;
  v_max_delay_ms := greatest(
    (extract(epoch from (v_round.ends_at - v_round.started_at)) * 1000 - 200)::int,
    200
  );

  for v_bot in select * from game_players where game_id = p_game_id and is_bot = true
  loop
    v_correct_probability := case v_bot.bot_difficulty
      when 'easy' then 0.45
      when 'medium' then 0.65
      when 'hard' then 0.85
      else 0.5
    end;
    v_will_be_correct := random() < v_correct_probability;

    if v_will_be_correct then
      v_selected := v_question.correct_option;
    else
      v_selected := (v_question.correct_option + 1 + floor(random() * 3)::int) % 4;
    end if;

    v_delay_ms := least(
      (case v_bot.bot_difficulty
        when 'easy' then 3000 + floor(random() * 5000)
        when 'medium' then 1500 + floor(random() * 4000)
        when 'hard' then 500 + floor(random() * 2500)
        else 2000 + floor(random() * 4000)
      end)::int,
      v_max_delay_ms
    );

    insert into game_answers (round_id, game_player_id, selected_option, is_correct, answered_at, response_time_ms)
    values (
      v_round.id, v_bot.id, v_selected, v_will_be_correct,
      v_round.started_at + make_interval(secs => v_delay_ms / 1000.0),
      v_delay_ms
    )
    on conflict (round_id, game_player_id) do nothing;
  end loop;
end;
$$;

-- Freezes the board: computes is_correct for every answer, ranks correct
-- answers by answered_at (1st/2nd/rest -> 3/2/1 points), and applies the
-- delta to game_players.score. Any participant's client can call this —
-- it independently re-checks now() >= ends_at, so calling it early or
-- twice is always a safe no-op, which is what makes it safe to trigger
-- from "whichever client's timer hits zero first" instead of relying on
-- a single host connection.
create or replace function reveal_round(p_round_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_round game_rounds;
  v_question questions;
  v_rank smallint := 0;
  v_answer record;
begin
  select * into v_round from game_rounds where id = p_round_id for update;
  if v_round is null then
    raise exception 'round_not_found';
  end if;
  if v_round.status <> 'active' then
    return jsonb_build_object('already_revealed', true);
  end if;
  if now() < v_round.ends_at then
    raise exception 'round_still_active';
  end if;

  select * into v_question from questions where id = v_round.question_id;

  update game_answers
  set is_correct = (selected_option = v_question.correct_option)
  where round_id = p_round_id;

  for v_answer in
    select id from game_answers
    where round_id = p_round_id and is_correct = true
    order by answered_at asc
  loop
    v_rank := v_rank + 1;
    update game_answers
    set rank_when_correct = v_rank,
        points_awarded = case v_rank when 1 then 3 when 2 then 2 else 1 end
    where id = v_answer.id;
  end loop;

  update game_players gp
  set score = gp.score + coalesce(ga.points_awarded, 0),
      correct_answers = gp.correct_answers + case when ga.is_correct then 1 else 0 end
  from game_answers ga
  where ga.round_id = p_round_id and ga.game_player_id = gp.id;

  update game_rounds set status = 'revealed', revealed_at = now() where id = p_round_id;

  return jsonb_build_object('revealed', true, 'correct_option', v_question.correct_option);
end;
$$;

grant execute on function reveal_round(uuid) to authenticated;

-- Called once the client-side ranking animation for the just-revealed
-- round has finished playing. Closes that round out and either starts the
-- next one or ends the game. Idempotent for the same reasons as
-- reveal_round.
create or replace function advance_game(p_game_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game games;
  v_round game_rounds;
  v_question_id uuid;
  v_next_round smallint;
begin
  select * into v_game from games where id = p_game_id for update;
  if v_game is null then
    raise exception 'game_not_found';
  end if;
  if v_game.status <> 'in_progress' then
    return jsonb_build_object('status', v_game.status);
  end if;

  select * into v_round from game_rounds
  where game_id = p_game_id and round_number = v_game.current_round;

  if v_round.status = 'active' then
    raise exception 'round_still_active';
  end if;
  if v_round.status = 'completed' then
    return jsonb_build_object('status', v_game.status, 'current_round', v_game.current_round);
  end if;

  update game_rounds set status = 'completed' where id = v_round.id;

  if v_game.current_round >= v_game.total_rounds then
    perform finish_game(p_game_id);
    return jsonb_build_object('status', 'finished');
  end if;

  v_next_round := v_game.current_round + 1;
  update games set current_round = v_next_round where id = p_game_id;

  v_question_id := pick_question_for_round(p_game_id);

  insert into game_rounds (game_id, round_number, question_id, status, started_at, ends_at)
  values (
    p_game_id, v_next_round, v_question_id, 'active', now(),
    now() + make_interval(secs => v_game.round_duration_seconds)
  );

  perform simulate_bot_answers(p_game_id, v_next_round);

  return jsonb_build_object('status', 'in_progress', 'current_round', v_next_round);
end;
$$;

grant execute on function advance_game(uuid) to authenticated;

-- Token/XP pacing: a solo win is worth about the same as a 3rd place in a
-- real match, in line with "Mode Solo: récompenses réduites". Kept as a
-- lookup function (rather than inlined in finish_game) so tuning the
-- economy later doesn't mean touching the scoring transaction itself.
create or replace function reward_for_placement(p_rank int, p_is_solo boolean)
returns table(tokens int, xp int)
language sql
immutable
as $$
  select
    (
      (case p_rank when 1 then 50 when 2 then 35 when 3 then 25 when 4 then 15 else 10 end)
      * (case when p_is_solo then 0.5 else 1 end)
    )::int,
    (
      (case p_rank when 1 then 100 when 2 then 80 when 3 then 60 when 4 then 40 else 25 end)
      * (case when p_is_solo then 0.5 else 1 end)
    )::int;
$$;

-- End-of-game settlement: ranks remaining (non-left) players by score,
-- credits tokens/xp/level and lifetime stats, and writes one
-- token_transactions row per human player. betiz.trusted is required here
-- because this is the one RPC allowed to move profiles.tokens/xp/level.
create or replace function finish_game(p_game_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game games;
  v_player record;
  v_rank int := 0;
  v_reward record;
  v_new_tokens int;
  v_new_xp int;
  v_game_avg_ms numeric;
  v_answered_count int;
  v_current profiles;
begin
  select * into v_game from games where id = p_game_id for update;
  if v_game.status = 'finished' then
    return;
  end if;

  perform set_config('betiz.trusted', 'on', true);

  for v_player in
    select * from game_players
    where game_id = p_game_id and status <> 'left'
    order by score desc, correct_answers desc
  loop
    v_rank := v_rank + 1;

    if not v_player.is_bot then
      select * into v_reward from reward_for_placement(v_rank, v_game.is_solo);
      select * into v_current from profiles where id = v_player.user_id;

      select avg(ga.response_time_ms), count(*)
        into v_game_avg_ms, v_answered_count
      from game_answers ga
      join game_rounds gr on gr.id = ga.round_id
      where gr.game_id = p_game_id
        and ga.game_player_id = v_player.id
        and ga.response_time_ms is not null;

      v_new_tokens := v_current.tokens + v_reward.tokens;
      v_new_xp := v_current.xp + v_reward.xp;

      update profiles
      set tokens = v_new_tokens,
          xp = v_new_xp,
          level = floor(v_new_xp / 500) + 1,
          games_played = games_played + 1,
          games_won = games_won + case when v_rank = 1 then 1 else 0 end,
          total_correct_answers = total_correct_answers + v_player.correct_answers,
          total_answers = total_answers + v_game.total_rounds,
          avg_response_time_ms = case
            when coalesce(v_answered_count, 0) = 0 then avg_response_time_ms
            else (
              (avg_response_time_ms * total_answers + v_game_avg_ms * v_answered_count)
              / greatest(total_answers + v_answered_count, 1)
            )::int
          end
      where id = v_player.user_id;

      insert into token_transactions (user_id, amount, balance_after, type, game_id)
      values (v_player.user_id, v_reward.tokens, v_new_tokens, 'game_reward', p_game_id);
    end if;
  end loop;

  update games set status = 'finished', ended_at = now() where id = p_game_id;
end;
$$;
