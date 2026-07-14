-- Purchases are entirely server-computed: cost is re-read from `animals`
-- (never trusted from the client), and the balance check + debit + catalog
-- unlock + ledger entry happen in one transaction so a player can never
-- end up with an animal they didn't pay for or a negative balance.
create or replace function unlock_animal(p_animal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_animal animals;
  v_profile profiles;
  v_new_tokens int;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select * into v_animal from animals where id = p_animal_id;
  if v_animal is null then
    raise exception 'animal_not_found';
  end if;

  if exists (select 1 from user_animals where user_id = v_user and animal_id = p_animal_id) then
    raise exception 'already_unlocked';
  end if;

  select * into v_profile from profiles where id = v_user for update;
  if v_profile.tokens < v_animal.unlock_cost then
    raise exception 'insufficient_tokens';
  end if;

  v_new_tokens := v_profile.tokens - v_animal.unlock_cost;

  perform set_config('betiz.trusted', 'on', true);
  update profiles set tokens = v_new_tokens where id = v_user;

  insert into user_animals (user_id, animal_id, source) values (v_user, p_animal_id, 'purchase');

  insert into token_transactions (user_id, amount, balance_after, type, animal_id)
  values (v_user, -v_animal.unlock_cost, v_new_tokens, 'purchase', p_animal_id);

  return jsonb_build_object('ok', true, 'tokens', v_new_tokens);
end;
$$;

grant execute on function unlock_animal(uuid) to authenticated;
