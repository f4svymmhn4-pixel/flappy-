-- Which animals a player has unlocked. Rows are only ever inserted by the
-- handle_new_user trigger (starter animals) or the unlock_animal RPC
-- (Backend step) — never directly by the client, so a player cannot grant
-- themselves an animal without paying for it.
create table user_animals (
  user_id uuid not null references profiles (id) on delete cascade,
  animal_id uuid not null references animals (id) on delete cascade,
  source unlock_source not null,
  unlocked_at timestamptz not null default now(),

  primary key (user_id, animal_id)
);

create index user_animals_user_id_idx on user_animals (user_id);

comment on table user_animals is
  'Per-user unlocked animal catalog. Insert-only from trusted server-side '
  'code paths (trigger for starters, RPC for purchases/rewards).';
