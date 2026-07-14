-- Public matchmaking pairs strangers who queue without seeing each other's
-- pick, so two players choosing the same popular starter animal (Chat,
-- Renard...) is common and must not break match formation (found by
-- testing try_match_queue with 5 simulated players). Private lobbies keep
-- their uniqueness expectation enforced in application code instead
-- (join_private_game's animal_taken check, which the player sees and can
-- react to before joining, since they can see who's already in the room);
-- duplicates in a public match are told apart by the pseudo label the
-- client renders under each animal.
drop index game_players_unique_animal;
