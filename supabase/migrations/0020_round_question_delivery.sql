-- The client can see game_rounds.question_id (participants have SELECT on
-- game_rounds) but questions itself has no RLS policy at all, so without
-- this there would be no way to actually render a round's prompt/options.
-- correct_option is only included once the round has moved past 'active'
-- — i.e. after reveal_round has run — so calling this early can never leak
-- the answer, regardless of what the client does with the response.
create or replace function get_round_question(p_round_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_round game_rounds;
  v_question questions;
begin
  select * into v_round from game_rounds where id = p_round_id;
  if v_round is null then
    raise exception 'round_not_found';
  end if;
  if not is_game_participant(v_round.game_id) then
    raise exception 'not_a_participant';
  end if;

  select * into v_question from questions where id = v_round.question_id;

  return jsonb_build_object(
    'round_id', v_round.id,
    'round_number', v_round.round_number,
    'status', v_round.status,
    'started_at', v_round.started_at,
    'ends_at', v_round.ends_at,
    'category_id', v_question.category_id,
    'prompt', v_question.prompt,
    'option_a', v_question.option_a,
    'option_b', v_question.option_b,
    'option_c', v_question.option_c,
    'option_d', v_question.option_d,
    'correct_option', case
      when v_round.status in ('revealed', 'completed') then v_question.correct_option
      else null
    end
  );
end;
$$;

grant execute on function get_round_question(uuid) to authenticated;
