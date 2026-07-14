-- Question categories, each mapped to a background theme (see the app's
-- AppColors/category background assets).
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  background_key text not null,
  icon text,
  sort_order integer not null default 0
);

comment on table categories is
  'Question categories (Culture générale, Cinéma, ...), each tied to a '
  'background_key used to pick the in-game background art.';

-- Designed to scale to tens of thousands of rows (see supabase/README.md
-- for the bulk-import format). Options are denormalized (option_a..d)
-- rather than a child table: it keeps CSV import trivial and a 4-option
-- question is a hard product requirement, not an evolving shape.
create table questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories (id),
  difficulty difficulty_level not null,
  language text not null default 'fr',
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option smallint not null,
  explanation text,
  source text,
  validation_status question_validation_status not null default 'pending',
  validated_by uuid references profiles (id),
  validated_at timestamptz,
  times_used integer not null default 0,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint questions_language_format check (language ~ '^[a-z]{2}$'),
  constraint questions_prompt_length check (char_length(prompt) between 5 and 300),
  constraint questions_correct_option_range check (correct_option between 0 and 3),
  constraint questions_options_not_blank check (
    length(trim(option_a)) > 0 and length(trim(option_b)) > 0
    and length(trim(option_c)) > 0 and length(trim(option_d)) > 0
  ),
  constraint questions_options_distinct check (
    option_a is distinct from option_b and option_a is distinct from option_c
    and option_a is distinct from option_d and option_b is distinct from option_c
    and option_b is distinct from option_d and option_c is distinct from option_d
  ),
  constraint questions_validation_consistency check (
    (validation_status = 'approved' and validated_at is not null)
    or (validation_status <> 'approved' and validated_by is null and validated_at is null)
  )
);

create index questions_selection_idx
  on questions (category_id, difficulty, language)
  where validation_status = 'approved';
create index questions_validation_status_idx on questions (validation_status);

comment on table questions is
  'Full question bank, including unvalidated/rejected submissions. Never '
  'exposed directly to authenticated clients (RLS denies SELECT) — the '
  'client only ever sees a round''s current question through the '
  'get_active_round_question RPC (Backend step), which strips '
  'correct_option until the round is revealed.';
comment on column questions.times_used is
  'Incremented by the round-selection RPC; lets question rotation favor '
  'less-seen questions over a fixed few favorites.';
