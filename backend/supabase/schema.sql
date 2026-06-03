-- ============================================================
-- Arcus Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================


-- ── profiles ────────────────────────────────────────────────
-- One row per user, created automatically on signup via trigger.

create table public.profiles (
  id            uuid        references auth.users(id) on delete cascade primary key,
  name          text,
  email         text,
  university    text,
  bio           text,
  position      text,
  skills        text[]      default '{}',
  startup_stage text,
  experience    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

-- Anyone can browse profiles (needed for Connect page)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only insert their own profile row
create policy "profiles: own insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can only update their own profile row
create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);


-- ── chat_messages ────────────────────────────────────────────
-- Stores per-user conversation history for arcus.ai.
-- LLM integration is handled separately — this table is scaffolded only.

create table public.chat_messages (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  role       text        check (role in ('user', 'assistant')) not null,
  content    text        not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "chat_messages: own access"
  on public.chat_messages for all
  using (auth.uid() = user_id);


-- ── roadmap_progress ─────────────────────────────────────────
-- Tracks per-user progress on each node of the startup roadmap.

create table public.roadmap_progress (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  node_id    text        not null,
  status     text        check (status in ('active', 'available', 'locked')) not null default 'locked',
  progress   integer     default 0 check (progress >= 0 and progress <= 100),
  updated_at timestamptz default now(),
  unique (user_id, node_id)
);

alter table public.roadmap_progress enable row level security;

create policy "roadmap_progress: own access"
  on public.roadmap_progress for all
  using (auth.uid() = user_id);


-- ── trigger: create profile on signup ────────────────────────
-- Automatically inserts a profiles row when a new auth user is created.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
