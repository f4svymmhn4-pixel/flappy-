-- Extensions used across the schema.
-- pgcrypto: gen_random_uuid() (built into core since PG13, kept explicit for clarity)
-- citext: case-insensitive text, used for the unique pseudo constraint
create extension if not exists pgcrypto;
create extension if not exists citext;
