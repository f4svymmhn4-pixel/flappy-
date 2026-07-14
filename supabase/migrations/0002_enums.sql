-- Enumerated types shared by multiple tables.

create type difficulty_level as enum ('easy', 'medium', 'hard');

create type animal_rarity as enum ('common', 'rare', 'epic', 'legendary');

create type game_visibility as enum ('public', 'private');

create type game_status as enum ('waiting', 'in_progress', 'finished', 'aborted');

create type game_player_status as enum ('joined', 'ready', 'disconnected', 'left');

create type round_status as enum ('pending', 'active', 'revealed', 'completed');

create type question_validation_status as enum ('pending', 'approved', 'rejected');

create type token_transaction_type as enum (
  'game_reward',
  'purchase',
  'admin_grant',
  'refund'
);

create type unlock_source as enum ('starter', 'purchase', 'reward', 'admin');

create type matchmaking_status as enum ('waiting', 'matched', 'cancelled');
