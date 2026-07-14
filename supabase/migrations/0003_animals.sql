-- Catalog of the 50 playable animals. Seeded in supabase/seed/002_animals.sql.
-- Exactly 3 rows are is_starter = true (free from account creation); the
-- other 47 are unlocked with tokens via user_animals (see 0004_profiles.sql
-- and the shop RPCs added in the Backend step).
create table animals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  rarity animal_rarity not null,
  unlock_cost integer not null default 0,
  is_starter boolean not null default false,
  sort_order integer not null default 0,
  description text,
  asset_idle_url text,
  asset_victory_url text,
  asset_defeat_url text,
  created_at timestamptz not null default now(),

  constraint animals_unlock_cost_check check (unlock_cost >= 0),
  constraint animals_starter_cost_check check (not (is_starter and unlock_cost > 0))
);

create index animals_rarity_idx on animals (rarity);
create index animals_sort_order_idx on animals (sort_order);

comment on table animals is
  'The 50-animal catalog. Starter animals (is_starter) are free; the rest '
  'are priced in tokens with cost increasing by rarity.';
