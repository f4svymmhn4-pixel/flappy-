-- Postgres grants EXECUTE on new functions to PUBLIC by default, which
-- would make every helper below callable over PostgREST the moment it's
-- created. Flip the default so each RPC has to be granted to `authenticated`
-- explicitly (see the `grant execute` line next to every client-facing
-- function from here on) — internal helpers (pick_question_for_round,
-- simulate_bot_answers, try_match_queue, ...) simply never get that grant.
alter default privileges in schema public revoke execute on functions from public;
