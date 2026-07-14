-- Matchmaking needs to know which animal to seat a player with once a
-- match forms. Added as a follow-up migration rather than editing 0008
-- to keep migration history append-only, even though nothing has shipped
-- to a real project yet.
alter table matchmaking_queue add column animal_id uuid not null references animals (id);

-- Superseded by the join_matchmaking()/leave_matchmaking() RPCs (added in
-- this step): those verify the caller actually unlocked animal_id before
-- queuing them, which a bare RLS check on this table can't do without
-- duplicating that ownership check here. Direct client writes are no
-- longer allowed; SELECT of one's own row is still fine.
drop policy matchmaking_queue_insert_own on matchmaking_queue;
drop policy matchmaking_queue_delete_own on matchmaking_queue;
