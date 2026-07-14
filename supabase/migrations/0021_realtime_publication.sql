-- Realtime is opt-in per table in Postgres/Supabase. Only the tables the
-- client actually needs to watch live are added here — lobby presence
-- (who's in a game) and in-match sync (score/round/answer updates).
-- questions stays out on purpose: it already has no RLS policy at all, and
-- streaming it would still be blocked, but there's no reason to publish it.
--
-- REPLICA IDENTITY FULL is required for UPDATE/DELETE payloads to include
-- the full row (not just the primary key + changed columns), which is what
-- supabase_flutter's `.stream()` helper needs to reconcile its local cache.
--
-- `create publication supabase_realtime` only runs if missing so this
-- migration also works against a bare self-hosted/local Postgres, which
-- has no such publication yet; a real Supabase project already has one.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end
$$;

alter table games replica identity full;
alter table game_players replica identity full;
alter table game_rounds replica identity full;
alter table game_answers replica identity full;

alter publication supabase_realtime add table games;
alter publication supabase_realtime add table game_players;
alter publication supabase_realtime add table game_rounds;
alter publication supabase_realtime add table game_answers;
