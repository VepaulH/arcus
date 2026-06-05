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


-- ── weekly_goals ─────────────────────────────────────────────
-- Per-user weekly targets, seeded from GOAL_SEEDS on first access.

create table public.weekly_goals (
  id            uuid        default gen_random_uuid() primary key,
  user_id       uuid        references auth.users(id) on delete cascade not null,
  title         text        not null,
  current_count integer     default 0 not null,
  target        integer     not null,
  unit          text        not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.weekly_goals enable row level security;

create policy "weekly_goals: own read"
  on public.weekly_goals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "weekly_goals: own insert"
  on public.weekly_goals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "weekly_goals: own update"
  on public.weekly_goals for update
  to authenticated
  using (auth.uid() = user_id);

create policy "weekly_goals: own delete"
  on public.weekly_goals for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "weekly_goals: service_role all"
  on public.weekly_goals for all
  to service_role
  using (true)
  with check (true);


-- ── onboarding_data ───────────────────────────────────────────
-- Stores survey answers and the computed roadmap_id per user.

create table public.onboarding_data (
  id              uuid        default gen_random_uuid() primary key,
  user_id         uuid        references auth.users(id) on delete cascade not null unique,
  revenue_range   text,
  looking_for     text,
  referral_source text,
  roadmap_id      text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.onboarding_data enable row level security;

create policy "onboarding_data: own read"
  on public.onboarding_data for select
  to authenticated
  using (auth.uid() = user_id);

create policy "onboarding_data: own insert"
  on public.onboarding_data for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "onboarding_data: own update"
  on public.onboarding_data for update
  to authenticated
  using (auth.uid() = user_id);

create policy "onboarding_data: service_role all"
  on public.onboarding_data for all
  to service_role
  using (true)
  with check (true);


-- ── connections ──────────────────────────────────────────────
-- Tracks connection requests between founders.

create table public.connections (
  id           uuid        default gen_random_uuid() primary key,
  requester_id uuid        references profiles(id) on delete cascade not null,
  addressee_id uuid        references profiles(id) on delete cascade not null,
  status       text        check (status in ('pending', 'accepted', 'declined')) default 'pending' not null,
  created_at   timestamptz default now() not null,
  unique(requester_id, addressee_id)
);

alter table public.connections enable row level security;

create policy "connections: own read"
  on public.connections for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "connections: own insert"
  on public.connections for insert
  with check (auth.uid() = requester_id);

create policy "connections: own update"
  on public.connections for update
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "connections: own delete"
  on public.connections for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);


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

-- Revoke direct-call access on SECURITY DEFINER trigger functions.
-- Triggers invoke these automatically; no user role should call them directly.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
